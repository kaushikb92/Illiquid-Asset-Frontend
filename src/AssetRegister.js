import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import hashFnv32a from './hash';
import Web3 from 'web3'
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Modal from 'react-bootstrap/lib/Modal';
import {assetAbi, atokenAbi, assetAddr, atokenAddr} from './constants'

var web3 = new Web3(new Web3.providers.HttpProvider("http://cil-blockchain1.uksouth.cloudapp.azure.com/api"))

var aName;
var assetUid;

var assetCon = web3.eth.contract(assetAbi).at(assetAddr);
var atokenCon = web3.eth.contract(atokenAbi).at(atokenAddr);

var walletAddr = web3.eth.accounts[0];

class AssetRegistration extends Component {

    constructor() {
        super();
        this.state = {
            assetName: '',
            assetQuantity: '',
            pricePerAsset: '',
            totalPrice: '',
            assetType: 'Bonds',
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

        closeModal() {
        this.setState({showModal : false})
    }

    handleChange (e) {
        
        this.setState({assetType:e.target.value});
    }

    submitClick(e) {
        assetUid = hashFnv32a(aName, Date.now(), true);
        this.setState({showModal: true});
        var tx = assetCon.addNewAsset(walletAddr, this.state.assetName,this.state.assetQuantity,this.state.pricePerAsset,this.state.assetType,assetUid,{from: walletAddr, gas: 2000000 });
        var tx1 = atokenCon.setAToken(walletAddr,assetUid,this.state.assetQuantity,{from: walletAddr, gas: 2000000 });
        e.preventDefault();
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
        { return (<div >You have assigned with {this.state.data} CT Tokens</div>); }
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
                                <label className="asset-label">Quantity of Asset :</label>
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
                </Modal.Header>
                </Modal>
            </div>
        );
    }
}

AssetRegistration.defaultProps = {
   categories: ['Bonds', 'Nano Stocks', 'Penny Stocks']
   
}

export default AssetRegistration;