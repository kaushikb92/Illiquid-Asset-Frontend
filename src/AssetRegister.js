import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import hashFnv32a from './hash';
import Web3 from 'web3'
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Modal from 'react-bootstrap/lib/Modal';
import {web3, userCon, assetCon, atokenCon, ctokenCon, txCon} from './constants';

//var web3 = new Web3(new Web3.providers.HttpProvider("http://cil-blockchain1.uksouth.cloudapp.azure.com/api"))

var aName;
var assetUid;

var userWallet;

var walletAddr = web3.eth.accounts[0];

class AssetRegistration extends Component {

    constructor() {
        super();
        this.state = {
            assetName: '',
            assetQuantity: '',
            pricePerAsset: '',
            totalPrice: '',
            assetType: 'Nano Stocks',
            showModal: false
        }
        this.updateState = this.updateState.bind(this);
        this.updateState1 = this.updateState1.bind(this);
        this.updateState2 = this.updateState2.bind(this);
        this.renderSubmit = this.renderSubmit.bind(this);
        this.renderTotal = this.renderTotal.bind(this);
        this.submitClick = this.submitClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        
    }

    componentWillMount(){
        var userId = window.localStorage.getItem('loginID');
        var loginStatus = window.localStorage.getItem('loginStatus');
        userWallet = userCon.getWalletByUserID(userId);
    }

    closeModal() {
        this.setState({showModal : false})
    }

    handleChange (e) {    
        this.setState({assetType:e.target.value});
    }

    submitClick(e) {
        var randomNum = hashFnv32a(this.state.assetName||Date.now(), false);
        var str = this.state.assetName;
        var strUp = str.toUpperCase();
        var res = str.substring(0,4);
        var res1 = randomNum.toString().substring(0,4);
        assetUid = res.concat(res1);
        console.log(assetUid);
        this.setState({showModal: true});
        var asn = this.state.assetName;
        var asqn = this.state.assetQuantity;
        var ppa = this.state.pricePerAsset;
        var at = this.state.assetType;
        
        this.f1(userWallet, asn,asqn,ppa,at,assetUid,walletAddr);
                
        e.preventDefault();
    }

    async f1(userWallet, asn,asqn,ppa,at,assetUid,walletAddr){
        var tx = await assetCon.addNewAsset(userWallet, asn,asqn,ppa,at,assetUid,{from: walletAddr, gas: 2000000 });
        this.f2(userWallet, asn,asqn,ppa,at,assetUid,walletAddr);
    }

    async f2(userWallet, asn,asqn,ppa,at,assetUid,walletAddr){
        var tx1 = await atokenCon.setAToken(userWallet,assetUid,asqn,{from: walletAddr, gas: 2000000 });
    }

    updateState(e) {
        this.setState({ assetName: e.target.value });
        aName = this.state.assetName;
    }

    updateState2(e) {
        this.setState({ pricePerAsset: e.target.value });
    }
    updateState1(e) {
        this.setState({ assetQuantity: e.target.value });
        this.renderTotal(this.state.assetQuantity, this.state.pricePerAsset);

    }

    renderSubmit() {
        if (this.state.formSub)
        { return (<div >Your have successfully registered {this.state.data.assetName} {this.state.data.assetType} </div>); }
        else return false;
    }
    renderTotal() {
        let c = (this.state.assetQuantity * this.state.pricePerAsset);
        console.log("total", c)
        this.setState({ totalPrice: c });
        return (<div>{this.state.totalPrice}</div>)
    }

    render() {
        let categoryOptions = this.props.categories.map(category => {
            return <option key={category} value={category} >{category}</option>
        });
        return (
            <div id="asset_regd" className="col-md-10 noPadding">
                <div className="row">
                    <div id="header">
                        <span id="Heading-name">Asset Registration ></span>
                    </div>
                </div>
                <div className="row">
                    <div id="Asset-Register-box" className="asset-regd-box ">
                        <h3><strong> Register your assets </strong> </h3>
                        <form autoComplete= "off">
                            <div>
                                <label className="asset-label">Asset name :</label>
                                <input className="input-box" type="text" id="input1" ref="title1" value={this.state.assetName} onChange={this.updateState} /><br />
                                <hr className="hr noPadding"></hr>
                                <label className="asset-label">Price per Asset :</label>
                                <input className="input-box" type="text" id="input3" ref="title3" value={this.state.pricePerAsset} onChange={this.updateState2} /><br />
                                <hr className="hr noPadding"></hr>
                                <label className="asset-label">Volume :</label>
                                <input className="input-box" type="text" id="input2" ref="title2" value={this.state.assetQuantity} onChange={this.updateState1} onKeyUp={this.renderTotal} /><br />
                                {this.renderTotal}
                                <hr className="hr noPadding"></hr>
                            
                            <label className="asset-label">Asset Type :</label>
                            <select id="asset-type-btn" ref="category" value={this.state.assetType} onChange={this.handleChange}>
                                {categoryOptions}
                            </select><hr className="hr noPadding"></hr>
                            <label className="asset-label"> Total Market value of Assets :</label>
                            <input className="input-box" type="text" id="input4" ref="title4" value={this.state.totalPrice} /><br />
                            <hr className="hr noPadding"></hr>
                            <button id="asset-submit-btn" className="Button-style" type="button" onClick={this.submitClick}>Submit</button>
                            </div>
                        </form>
                        {this.renderSubmit}
                    </div>
                </div>
                <Modal show={this.state.showModal} onHide={this.closeModal} >
                                <Modal.Header closeButton className="custom-modal" >
                                    <Modal.Title>Congratulations !!! <br /> Registration of {this.state.assetName} done successfully </Modal.Title>
                                    <Link to="assetView"><button id="user-regd-ok-btn" type="button">Ok</button></Link>
                </Modal.Header>
                </Modal>
            </div>
        );
    }
}

AssetRegistration.defaultProps = {
   categories: [ 'Nano Stocks', 'Penny Stocks']
   
}

export default AssetRegistration;