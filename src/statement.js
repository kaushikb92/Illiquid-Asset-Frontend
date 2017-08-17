import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
// import Exchange from './Exchange';
import Modal from 'react-bootstrap/lib/Modal';
import Web3 from 'web3'
import {web3, userCon, assetCon, atokenCon, ctokenCon, txCon} from './constants';
//var web3 = new Web3(new Web3.providers.HttpProvider("http://cil-blockchain1.uksouth.cloudapp.azure.com/api"));

var walletAddr = web3.eth.accounts[0];

var userWallet;

export default class Statement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            assetData: [],
            tradeViewDetails: false,
            selectedData: {},
            assetTxId: '',
            currencyTxId:'',
            sellerName: '',
            buyerName: '',
            tradeAssetName: '',
            tradeQty: '',
            tradeAmount: '',
            role:''
        }
        this.openTradeViewDetails = this.openTradeViewDetails.bind(this);
        this.closeTradeView = this.closeTradeView.bind(this);
    }
    componentWillMount() {
        var userId = window.localStorage.getItem('loginID');
        var loginStatus = window.localStorage.getItem('loginStatus');
        this.getWalletAddress(userId);
        
    }

    async getWalletAddress(userId){
        userWallet = await userCon.getWalletByUserID(userId);
        this.getTx(userWallet);
    }
    
    async getTx(userWallet){
        var data = [];
        var tradeDetails = txCon.getAllTx();
        var len = tradeDetails[0].length;
        var i;
        var role1;
        for (i = 0; i < len; i++) {
            if(userWallet == tradeDetails[2][i]) {
                var seller = userCon.getUsernameByAddress(tradeDetails[2][i]);
                var buyer = userCon.getUsernameByAddress(tradeDetails[3][i]);
                var assetN = assetCon.getAssetNamebyAssetID(tradeDetails[4][i]);
                var blckNum = web3.eth.getTransactionReceipt(tradeDetails[0][i]).blockNumber;
                var time = web3.eth.getBlock(blckNum).timestamp;
                var time1 = new Date(time * 1000);
                role1 = "Sell";
            data.push({ assetTxId: tradeDetails[0][i], currencyTxId: tradeDetails[1][i], buyerName: web3.toAscii(buyer[0]), sellerName: web3.toAscii(seller[0]), tradeAssetName: web3.toAscii(assetN),tradeQty: tradeDetails[5][i].c[0], tradeAmount: tradeDetails[6][i].c[0],blockTime: time1.toLocaleString(), role: role1 })
        }
        else if(userWallet == tradeDetails[3][i]){
                role1 = "Buy"; 
                var seller = userCon.getUsernameByAddress(tradeDetails[2][i]);
                var buyer = userCon.getUsernameByAddress(tradeDetails[3][i]);
                var assetN = assetCon.getAssetNamebyAssetID(tradeDetails[4][i]);
                var blckNum = web3.eth.getTransactionReceipt(tradeDetails[0][i]).blockNumber;
                var time = web3.eth.getBlock(blckNum).timestamp;
                var time1 = new Date(time * 1000);
            data.push({ assetTxId: tradeDetails[0][i], currencyTxId: tradeDetails[1][i], buyerName: web3.toAscii(buyer[0]), sellerName: web3.toAscii(seller[0]), tradeAssetName: web3.toAscii(assetN),tradeQty: tradeDetails[5][i].c[0], tradeAmount: tradeDetails[6][i].c[0],blockTime: time1.toLocaleString(), role: role1 })
        }
        }
        this.setState({ assetData: data });
    }
    openTradeViewDetails(emp) {
        this.setState({selectedData: emp});
            this.setState({openTradeViewDetails: true});
            this.setState({showModal: true});
        console.log(emp)
    }
    closeTradeView() {
        this.setState({ showModal: false, openTradeViewDetails : false  });
    }
    render() {
        if (this.state.openTradeViewDetails) {
            return (
                <div className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="custom-modal">
                        <div id="mp-modal" className="custom-modal">
                            <Modal show={this.state.showModal} onHide={this.closeTradeView} >
                                <Modal.Header closeButton className="custom-modal" >
                                    <Modal.Title>Trade Transaction Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="custom-modal">
                                    <div className="modal-header custom-modal-1">
                                        <label>Asset Transaction Id:</label><output className="modal-output"></output>{this.state.selectedData.assetTxId}
                                        <br />
                                        <label>Currency Transaction Id:</label><output className="modal-output"></output>{this.state.selectedData.currencyTxId}
                                        <br />
                                        <label>Seller Name:</label><output className="modal-output"></output>
                                        {this.state.selectedData.sellerName}<br />
                                        <label>Buyer Name:</label><output className="modal-output"></output>
                                        {this.state.selectedData.buyerName}<br />
                                        <label>Traded Quantity:</label><output className="modal-output"></output>
                                        {this.state.selectedData.tradeQty}<br />
                                        <label>Traded amount:</label><output className="modal-output"></output>
            {(this.state.selectedData.tradeAmount).toLocaleString()}<br />
                                        <button className="Btn-mkt-style Button-dark-theme" type="button" onClick={this.closeTradeView}>Ok</button>
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
                        <span id="Heading-name">Trade Ledger ></span>
                    </div>
                </div>
                <div className="row">
                    <div className="tablediv">
                        <table className="myTable">
                            <thead className="tablehead-blc-exp">
                                <tr id="tablerow">
                                    <th className="tableHeading width20">Asset Name</th>
                                    <th className="tableHeading width20">Buy/Sell</th>
                                    <th className="tableHeading width20">Quantity</th>
                                    <th className="tableHeading width20">Net Amount</th>
                                    <th className="tableHeading width20">Trade Date & Time</th>
                                </tr>
                            </thead>
                            <tbody className="tableBody-blc-exp">
                                {
                                    this.state.assetData.map(function (emp, i) {
                                        return (<tr className="table-style-menu" key={i} value={self.state.tradeView} name="tradeView" onClick={() => self.openTradeViewDetails(emp)}>
                                            <td className="tableData width20 ">{emp.tradeAssetName}</td>
                                            <td className="tableData width20 ">{emp.role}</td>
                                            <td className="tableData width20 ">{emp.tradeQty}</td>
                                            <td className="tableData width20 amtRight">{emp.tradeAmount.toLocaleString()}</td>
                                            <td className="tableData width20 ">{emp.blockTime}</td>
                                            
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