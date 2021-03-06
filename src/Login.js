import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.css';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import RegistrationForm from './registrationForm'
import RegisterHeading from './registerHeading'
import Modal from 'react-bootstrap/lib/Modal';
//var web3 = new Web3(new Web3.providers.HttpProvider("http://cil-blockchain1.uksouth.cloudapp.azure.com/api"));
import { web3, userCon, assetCon, atokenCon, ctokenCon, txCon } from './constants';

var walletAddr = web3.eth.accounts[0];

var userWallet;

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openRegister: false,
            showModal: false
        }
        this.openRegisterWindow = this.openRegisterWindow.bind(this);
        this.resetloginUserID = this.resetloginUserID.bind(this);
        this.resetloginPassword = this.resetloginPassword.bind(this);
        this.submitClick = this.submitClick.bind(this);
        this.updateStateALL = this.updateStateALL.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    closeModal() {
        this.setState({
            loginFailed: false,
            loginSuccess: false,
            showModal: false
        })
    }
    openLoginWindow() {
        this.setState({ openRegister: false })
    }
    openRegisterWindow() {
        this.setState({ openRegister: true })
    }
    resetloginUserID() {
        this.setState({ loginidval: "" });
    }
    resetloginPassword() {
        this.setState({ loginpwdval: "" });
    }
    updateStateALL(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    submitClick(e) {
        // var WalletLoginSuccess = web3.personal.unlockAccount(web3.eth.accounts[0],this.state.loginpwdval);
        var contractLoginSuccess = userCon.getLogin(this.state.loginidval, this.state.loginpwdval);
        var loginId = this.state.loginidval;
        var pwd = this.state.loginpwdval;
        this.f1(loginId, pwd, contractLoginSuccess);
    }

    async f1(loginId, pwd, contractLoginSuccess) {
        userWallet = await userCon.getWalletByUserID(loginId);
        this.f3(loginId, pwd, userWallet, contractLoginSuccess);
    }

    async f2(pwd, userWallet) {
        var walletUnlockStatus = await web3.personal.unlockAccount(userWallet, pwd);
        console.log(walletUnlockStatus);
    }

    async f3(loginId, pwd, userWallet, contractLoginSuccess) {
        if (contractLoginSuccess == true) {               //&& WalletLoginSuccess == true
            // alert("Login success");
            this.setState({
                loginSuccess: true,
                showModal: true
            })
            window.localStorage.setItem('loginStatus', contractLoginSuccess);
            window.localStorage.setItem('loginID', loginId);
            this.f2( pwd, userWallet);
        }
        else {
            // alert("Login failed");           
            this.setState({
                loginFailed: true,
                showModal: true
            })
        }
    }


    render() {

        if (this.state.loginSuccess) {
            return (
                <Modal show={this.state.showModal} onhide={this.closeModal}>
                    <Modal.Header closeButton className="custom-modal" >
                        <Modal.Title>Congratulations <br /> Login successful !!!</Modal.Title>
                        <Link to="marketPlace"><button id="user-regd-ok-btn" type="button">Ok</button></Link>
                    </Modal.Header>
                </Modal>
            )
        }
        if (this.state.loginFailed) {
            return (
                <Modal show={this.state.showModal} onhide={this.closeModal}>
                    <Modal.Header closeButton className="custom-modal" >
                        <Modal.Title>Login failed<br /> Please check Userid or Password</Modal.Title>
                        <button id="user-regd-ok-btn" type="button" onClick={this.closeModal}>Ok</button>
                    </Modal.Header>
                </Modal>
            )
        }
        if (this.state.openRegister) {
            return (
                <div>
                    <RegisterHeading />
                    <RegistrationForm openLogin={this.openLoginWindow.bind(this)} />
                </div>
            )
        }
        return (
            <div>
                <div id="header">
                    <span id="Heading-name">Home ></span>
                </div>

                <div id="Info-box" className="col-md-5">
                    >>> Proof of Concept marketplace /exchange for the trade of illiquid instruments – based on blockchain - decentralised, distributed ledger technology.<br /><br /><br />
                    >>> Undertaken by HCL {/*in collaboration with Deutsche Bank*/}
                </div>

                <div id="login-body">
                    <div id="Register-box" className="col-md-5">
                        <div id="login-input-box" >
                            <form autoComplete="off">
                                <label id="user-id">User ID:</label>
                                <input id="user-id-input" className="input-box" value={this.state.loginidval} onChange={this.updateStateALL} name="loginidval" />
                                <button id="dlt-btn-userid" className="delete-button login-delete-btn" onClick={this.resetloginUserID} type="button">X</button>
                                <hr className="hr-width hr noPadding"></hr>

                                <label id="user-password">Password:</label>
                                <input id="user-password-input" type="password" value={this.state.loginpwdval} onChange={this.updateStateALL} className="input-box" name="loginpwdval" />
                                <button id="dlt-btn-userid" className="delete-button login-delete-btn" onClick={this.resetloginPassword} type="button">X</button>
                                <hr className="hr-width hr noPadding"></hr>

                                <button className="Button-style" id="user-login-button" type="button" onClick={this.submitClick}>login</button><br />
                                {/*<div id="no-account-box">
                                    <span>New User?</span>
                                    <a onClick={this.openRegisterWindow}> Click here to Register</a><br />
                                </div>*/}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

}