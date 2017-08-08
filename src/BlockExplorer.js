import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Modal from 'react-bootstrap/lib/Modal';
import Web3 from 'web3';
var web3 = new Web3(new Web3.providers.HttpProvider("http://cil-blockchain1.uksouth.cloudapp.azure.com/api"));

export default class BlockExplorer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Block: [],
            selectedData: {},
            showModal: false,
        }
        this.closeConfirmBuy = this.closeConfirmBuy.bind(this);
        this.blockDetails = this.blockDetails.bind(this);
    }
    componentWillMount() {
        var data = [];
        var blockNum = web3.eth.getBlock('latest').number;
        //console.log(web3.eth.getBlock(100));
        for (var j = blockNum; j >= 0; j--) {
            //console.log(j);
            var block = web3.eth.getBlock(j);
            var time = block.timestamp;
            var time1 = new Date(time * 1000);
            var timeStamp = time1.toLocaleString();
            if (block.transactions.length > 0) {
                // for (var  = 0; k < web3.eth.getBlock(j).transactions.length; k++) {
                data.push({ blockNumber: block.number, transactionHash: block.hash, miner: block.miner, blockDiff: block.difficulty.c[0], totalDiff: block.totalDifficulty.c[0], nonce: block.nonce, blockSize: block.size, gasUsed: block.gasUsed, gasLimit: block.gasLimit, timestamp: timeStamp })
                //console.log(this.state.transactionDetails);
                console.log(block);


            }    //console.log(web3.eth.getBlock(j).transactions);
        }
        this.setState({ Block: data });
    }
    blockDetails(emp) {
        this.setState({ selectedData: emp });
        console.log(this.state.selectedData)
        console.log(this.state.emp)
        this.setState({ blockDetails: true });
        this.setState({ showModal: true });

    }
    closeConfirmBuy() {
        this.setState({
            showModal: false,
            blockDetails: false,
        });
    }


    render() {
        if (this.state.blockDetails) {
            return (
                <div className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="custom-modal">
                        <div id="mp-modal" className="custom-modal">
                            <Modal show={this.state.showModal} onHide={this.closeConfirmBuy} >
                                <Modal.Header closeButton className="custom-modal">
                                    <Modal.Title>Purchase asset</Modal.Title>
                                </Modal.Header>

                                <Modal.Body className="custom-modal">

                                    <div className="modal-header custom-modal-1">
                                        <span>Block number: {this.state.selectedData.blockNumber}</span>
                                        <br />
                                        <span>Time:{this.state.selectedData.timestamp}</span>
                                        <br />
                                        <span>Block Header: {this.state.selectedData.transactionHash}</span>
                                        <br />
                                        <span>Nonce:{this.state.selectedData.nonce}</span>
                                        <br />
                                        <span>Transaction id: {this.state.selectedData.transactionHash}</span>
                                        <br />
                                        <span>Miner:{this.state.selectedData.miner}</span>
                                        <br />
                                        <span>Block Size:{this.state.selectedData.blockSize}</span>
                                        <br />
                                        <span>Block Difficulty: {this.state.selectedData.blockDiff}</span>
                                        <br />
                                        <span>Total Difficulty:{this.state.selectedData.totalDiff}</span>
                                        <br />
                                        <span>Gas Limit: {this.state.selectedData.gasLimit}</span>
                                        <br />
                                        <span>Gas Used:{this.state.selectedData.gasUsed}</span>
                                        <br />
                                        <button className="Btn-mkt-style Button-dark-theme" onClick={this.closeConfirmBuy} type="button" >Ok</button>
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
            <div id="Asset-View" className="col-md-10 noPadding">
                <div className="row">
                    <div id="header">
                        <span id="Heading-name">Block Explorer></span>
                    </div>
                </div>
                <div className="tablediv-blc-exp">
                  <table className="myTable-blc-exp">
                        <thead className="tablehead-blc-exp">
                            <tr className="tablerow-blc-exp">
                                <th className="tableHeading-blc-exp width18">Block number</th>
                                <th className="tableHeading-blc-exp width18">Time</th>
                                <th className="tableHeading-blc-exp width64">Block Header</th>

                            </tr>
                        </thead>

                        <tbody className="tableBody-blc-exp">
                            {
                                this.state.Block.map(function (emp, i) {
                                    return (<tr className="table-style-menu-blc-exp" value={self.state.blcDetails} name="blcDetails" onClick={() => self.blockDetails(emp)} key={i}>
                                        <td className="tableData-blc-exp width18">{emp.blockNumber}</td>
                                        <td className="tableData-blc-exp width18">{emp.timestamp}</td>
                                        <td className="tableData-blc-exp width64">{emp.transactionHash}</td>
                                    </tr>);
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
