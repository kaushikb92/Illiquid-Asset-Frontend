import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import Web3 from 'web3'
import {userAddr, ctokenAddr, userAbi, ctokenAbi } from './constants.js'

var web3 = new Web3(new Web3.providers.HttpProvider("http://cil-blockchain1.uksouth.cloudapp.azure.com/api"))

var walletAddr = web3.eth.accounts[0];

var userCon = web3.eth.contract(userAbi).at(userAddr);
var ctokenCon = web3.eth.contract(ctokenAbi).at(ctokenAddr);

var dataBE;
var data;

class UserProfile extends React.Component {
    constructor() {
        super();
        this.state = { user: {} };

    }
    componentWillMount() {
        var dataBE = userCon.getUserDetailsByWallet(walletAddr);
        var data = [
            { userName1: web3.toAscii(dataBE[0]),userName2: web3.toAscii(dataBE[1]), UID: web3.toAscii(dataBE[3]), Mobile: dataBE[4].c[0], PAN: web3.toAscii(dataBE[2]) },
        ];
        this.setState({ user: data });
    }
    renderDetails() {
        let c = data.userName1;
        this.setState({ userName1: c });
        return (<div>{this.state.userName}</div>)
    }
    updateState(e) {
        this.setState({ data: e.target.value });
    }
    render() {
        return (
            <div className="col-md-10 noPadding">
                <div className="row">
                    <div id="header">
                        <span id="Heading-name"> Profile ></span>
                    </div>

                    <div id="mkt-btn-box" className="row">
                        <Link to="MarketPlace"><button id="btn-buy" className="Btn-mkt-style">Buy</button></Link>
                        <Link to="AssetView"><button id="btn-sell" className="Btn-mkt-style">Sell</button></Link>
                    </div>
                </div>
                <div className="row">
                    <div id="user-Profile-box" >
                        <h3 className="center-align">Profile Details</h3>
                        <hr className="profile-underline"></hr>
                        <form>
                            <div>
                                {
                                    this.state.user.map(function (emp, i) {
                                        return (
                                            <div id="user-details" key={i}>
                                                <label>User Name :</label><output id="userName" className="profile-output">{emp.userName1}{' '}{emp.userName2}</output><br />
                                                <label>UID : </label> <output id="UID" className="profile-output">{emp.UID}</output><br />
                                                <label>Mobile no: </label><output id="Mobile no" className="profile-output">{emp.Mobile}</output><br />
                                                <label>PAN ID:</label><output id="PAN" className="profile-output">{emp.PAN}</output><br />
                                                <label>Your Balance:</label><output id="Balance" className="profile-output">{ctokenCon.getCTBalance(walletAddr).c[0].toLocaleString()}</output>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </form>
                       </div>
                </div>
            </div>
        );
    }
}
export default UserProfile;
