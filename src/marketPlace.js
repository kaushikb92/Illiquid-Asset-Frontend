import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Modal from 'react-bootstrap/lib/Modal';
import Web3 from 'web3'
import { userAddr, ctokenAddr, assetAddr, atokenAddr, txAddr, atokenAbi, userAbi, ctokenAbi, txAbi, assetAbi } from './constants.js';
var web3 = new Web3(new Web3.providers.HttpProvider("http://cil-blockchain1.uksouth.cloudapp.azure.com/api"));
var userCon = web3.eth.contract(userAbi).at(userAddr);
var assetCon = web3.eth.contract(assetAbi).at(assetAddr);
var atokenCon = web3.eth.contract(atokenAbi).at(atokenAddr);
var ctokenCon = web3.eth.contract(ctokenAbi).at(ctokenAddr);
var txCon = web3.eth.contract(txAbi).at(txAddr);
var walletAddr = web3.eth.accounts[0];
export default class MarketPlace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            assetData: [],
            openConfirmBuy: false,
            confirmExchange: false,
            selectedData: {},
            // selectedQty: ,
            handleOpenCard: false,
            sellerAddress: '',
            assetids: ''
        }
        this.openConfirmBuy = this.openConfirmBuy.bind(this);
        this.confirmExchange = this.confirmExchange.bind(this);
        this.quantityRequest = this.quantityRequest.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOpenCard = this.handleOpenCard.bind(this);
        this.startTrade = this.startTrade.bind(this);
        this.closeConfirmBuy = this.closeConfirmBuy.bind(this);
    }
    quantityRequest(e) {
        this.setState({ selectedQty: e.target.value });
        // console.log(this.state.selectedQty)
    }
    renderSubmit() {
        if (this.state.formSub)
        { return (<div >You have assigned with {this.state.data} CT Tokens</div>); }
        else return false;
    }
    handleSubmit(e) {
        if (this.refs.title.value === '') {
            alert('Amount is required');
        } else {
            this.setState({
                newProject: {
                    title: this.refs.title.value,
                    category: this.refs.category.value
                }, formSub: "true"
            }, function () {
                console.log("hi", this.state);
                let x = this.state.data;
                alert('You have assigned ' + x + ' CT Tokens');
            });
        }
        e.preventDefault();
    }
    openConfirmBuy(emp) {
        this.setState({ selectedData: emp });
        this.setState({ openConfirmBuy: true });
        this.setState({ showModal: true });
    }
    closeConfirmBuy() {
        this.setState({
            showModal: false,
            openConfirmBuy: false,
            confirmExchange: false,
            handleOpenCard: false,
        });
    }
    handleOpenCard() {
        this.setState({ handleOpenCard: true });
        this.setState({ confirmExchange: false });
    }
    confirmExchange() {
        this.setState({ confirmExchange: true });
    }
    componentWillMount() {
        var data = [];
        var assetDetails = assetCon.getAllAssetDetails();
        var len = assetDetails[0].length;
        var i;
        for (i = 0; i < len; i++) {
            var assetQnty = atokenCon.getATBalanceOfUser(assetDetails[1][i], assetDetails[0][i]);
            var assetOwner = userCon.getUserDetailsByWallet(assetDetails[1][i]);
            data.push({ assetName: web3.toAscii(assetDetails[3][i]), ownerName: web3.toAscii(assetOwner[0]), pricePerAsset: assetDetails[4][i].c[0], quantity: assetQnty.c[0], assetType: web3.toAscii(assetDetails[2][i]), sellerAddress: assetDetails[1][i], assetids: assetDetails[0][i] })
        }
        this.setState({ assetData: data });
    }
    closeBuyAsset() {
        this.setState({ showModal: false });
    }
    async f1(amt, aid, seller, assetAmt, assetTx, currencyTx) {
        var x = await ctokenCon.setCTokenBalance(walletAddr, amt, { from: walletAddr, gas: 2000000 });
        assetTx = await atokenCon.ATtransfer(aid, seller, walletAddr, assetAmt, { from: walletAddr, gas: 2000000 });
        this.f2(amt, aid, seller, assetAmt, assetTx, currencyTx);
    }
    async f2(amt, aid, seller, assetAmt, assetTx, currencyTx) {
        currencyTx = await ctokenCon.CTtransferFrom(walletAddr, seller, amt, { from: walletAddr, gas: 2000000 });
        var curT = await ctokenCon.getCTBalance(walletAddr);
        this.f3(amt, aid, seller, assetAmt, assetTx, currencyTx);
    }
    async f3(amt, aid, seller, assetAmt, assetTx, currencyTx) {
        var txa = await assetCon.addAssetWithWalletAfterSell(walletAddr, aid, { from: walletAddr, gas: 2000000 });
        this.f4(amt, aid, seller, assetAmt, assetTx, currencyTx);
    }
    async f4(amt, aid, seller, assetAmt, assetTx, currencyTx) {
        var recordTx = await txCon.addTx(assetTx, currencyTx, seller, walletAddr, aid, assetAmt, amt, { from: walletAddr, gas: 2000000 });
    }
    startTrade() {
        var assetTx;
        var currencyTx;
        var amt = this.state.selectedQty * this.state.selectedData.pricePerAsset;
        var assetAmt = this.state.selectedQty;
        var seller = this.state.selectedData.sellerAddress;
        var aid = this.state.selectedData.assetids;
        this.f1(amt, aid, seller, assetAmt, assetTx, currencyTx);
    }
    handleCancel() {
        this.setState({
            confirmExchange: false,
            openConfirmBuy: false,
            handleOpenCard: false
        })
    }
    render() {
        if (this.state.confirmExchange) {
            return (
                <div>
                    <div id="header">
                        <span id="Heading-name">Exchange ></span>
                    </div>
                    <div id="exchange-box-right" className="col-md-5 exchange-box">
            <h5> You have selected <strong>{this.state.selectedQty} </strong>assets of {this.state.selectedData.assetName} and the total amount is  {(this.state.selectedQty * this.state.selectedData.pricePerAsset).toLocaleString()} {console.log(this.state.selectedQty)} {console.log( this.state.selectedData.pricePerAsset)}  </h5>
                        <h5> To proceed with the transaction click <strong>OK</strong></h5>
                        <h5> Click on <strong>Cancel</strong> to abort transaction and roll back to Marketplace  </h5>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <button id="exchange-ok-btn" className="Button-style" type="button" onClick={this.handleOpenCard} >OK</button>
                            <button id="exchange-cancel-btn" className="Button-style" type="button" onClick={this.handleCancel}>Cancel</button>
                        </form>
                        {this.renderSubmit()}
                    </div>
                </div>
            );
        }
        if (this.state.handleOpenCard) {
            return (
                <div>
                    <div id="header">
                        <span id="Heading-name">Transaction ></span>
                    </div>
                    <div id="exchange-box-left" className="col-md-5 exchange-box">
                        <p>Please enter your card details to proceed with the transaction</p>
                        <input className="exchange-box-left-input" placeholder="Name.."></input>  <br />
                        <input className="exchange-box-left-input" placeholder="Card No.."></input> <br />
                        <input className="exchange-box-left-input" placeholder="Expiry date.."></input> <br />
                        <input className="exchange-box-left-input" placeholder="CVV.."></input>
                        <Link to="statement"><button id="card-ok-btn" className="Btn-mkt-style" type="button" onClick={this.startTrade}>OK</button></Link>
                    </div>
                </div>
            );
        }
        if (this.state.openConfirmBuy) {
            return (
                <div className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="custom-modal">
                        <div id="mp-modal" className="custom-modal">
                            <Modal show={this.state.showModal} onHide={this.closeConfirmBuy} >
                                {/*<Modal show={this.state.showModal} onHide={this.state.hideModal} >*/}
                                <Modal.Header closeButton className="custom-modal">
                                    <Modal.Title>Purchase asset</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="custom-modal">
                                    <div className="modal-header custom-modal-1">
                                        <span>Name of Asset:{this.state.selectedData.assetName}</span>
                                        <br />
                                        <span>Name of Owner:{this.state.selectedData.ownerName}</span>
                                        <br />
                                        <span>Asset Type:{this.state.selectedData.assetType}</span>
                                        <br />
                                        <span>Price per Asset:{(this.state.selectedData.pricePerAsset).toLocaleString()}</span>
                                        <br />
                                        <span>Quantity:</span><input id="model-input-box-dark" className="input-box" value={this.state.selectedQty}
                                            onChange={this.quantityRequest} placeholder="Enter the Quantity.." type="number" min="1"></input>
                                        <br />
                                        <button className="Btn-mkt-style Button-dark-theme" onClick={this.confirmExchange} type="button" >Submit</button>
                                    </div>
                                    <div className="modal-body"></div>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                </div>
            );
        }
        var self = this;
        return (
            <div id="marketPlace" className="col-md-10 noPadding">
                <div className="row">
                    <div id="header">
                        <span id="Heading-name">MarketPlace ></span>
                    </div>
                </div>
                <div className="row">
                    <div>
                        <input className="assetSearch" type="text" placeholder="Search..."
                            value={this.props.filterText}
                            ref="filterTextInput"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="tablediv">
                        <table className="myTable">
                            <thead className="tablehead-blc-exp">
                                <tr id="tablerow">
                                    <th className="tableHeading width20">Asset Name</th>
                                    <th className="tableHeading width20">Asset owner</th>
                                    <th className="tableHeading width20">Asset Type</th>
                                    <th className="tableHeading width20">Price per asset</th>
                                    <th className="tableHeading width20">Quantity</th>
                                </tr>
                            </thead>
                            <tbody className="tableBody-blc-exp">
                                {
                                    this.state.assetData.map(function (emp, i) {
                                        return (<tr className="table-style-menu" key={i} value={self.state.confirmBuy} name="confirmBuy" onClick={() => self.openConfirmBuy(emp)}>
                                            <td className="tableData width20">{emp.assetName}</td>
                                            <td className="tableData width20">{emp.ownerName}</td>
                                            <td className="tableData width20">{emp.assetType}</td>
                                        <td id="assetprice"className="tableData width20 amtRight">{(emp.pricePerAsset).toLocaleString()}</td>
                                            <td className="tableData width20 amtRight">{emp.quantity}</td>
                                        </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}