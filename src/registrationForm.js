import React from 'react';
import hashFnv32a from './hash';
import Web3 from 'web3'
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import { userAddr, userAbi } from './constants.js'
import Modal from 'react-bootstrap/lib/Modal';

var web3 = new Web3(new Web3.providers.HttpProvider("http://cil-blockchain1.uksouth.cloudapp.azure.com/api"))

var walletAddr = web3.eth.accounts[0];

var userCon = web3.eth.contract(userAbi).at(userAddr);

class RegistrationForm extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      panID: '',
      password: '',
      confirmPassword: '',
      showModal: false
    }
    this.updateStateALL = this.updateStateALL.bind(this);
    this.submitClick = this.submitClick.bind(this);
    this.resetregdFrstName = this.resetregdFrstName.bind(this);
    this.resetregdLastName = this.resetregdLastName.bind(this);
    this.resetregdMobile = this.resetregdMobile.bind(this);
    this.resetregdPAN = this.resetregdPAN.bind(this);
    this.resetregdPwd = this.resetregdPwd.bind(this);
    this.resetregdConfPwd = this.resetregdConfPwd.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  closeModal() {
    this.setState({ showModal: false })
  }
  resetregdFrstName() {
    this.setState({ firstName: "" });
  }
  resetregdLastName() {
    this.setState({ lastName: "" });
  }
  resetregdMobile() {
    this.setState({ mobileNumber: "" });
  }
  resetregdPAN() {
    this.setState({ panID: "" });
  }
  resetregdPwd() {
    this.setState({ password: "" });
  }
  resetregdConfPwd() {
    this.setState({ confirmPassword: "" });
  }
  updateStateALL(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  submitClick(e) {
    if (this.state.password == this.state.confirmPassword)
      this.setState({ showModal: true });
    else{
      this.state.password.value.toString = "";
      this.state.confirmPassword.value.toString = "";
    }
    var userid = hashFnv32a((this.state.firstName || this.state.lastName || this.state.panID), true);
    var tx = userCon.addNewUser(this.state.firstName, this.state.lastName, walletAddr, this.state.panID, userid, this.state.password, this.state.mobileNumber, { from: walletAddr, gas: 2000000 });
    e.preventDefault();
  }

  render() {
    return (
      <div id="register-body">
        <div id="user-Register-box" className="col-md-5">

          <div id="login-input-box" >
            <form autoComplete="off">
              <label className="asset-label" id="user-first-name" >First Name:</label>
              <input id="user-name-input" className="input-box" onChange={this.updateStateALL} value={this.state.firstName} name="firstName" />
              <button id="dlt-btn-firstName" className="delete-button regd-delete-btn" onClick={this.resetregdFrstName} type="button">X</button>
              <hr className="hr-width hr noPadding"></hr>

              <label className="asset-label" id="user-last-name" >Last Name:</label>
              <input id="user-last-input" className="input-box" onChange={this.updateStateALL} value={this.state.lastName} name="lastName" />
              <button id="dlt-btn-lastName" className="delete-button regd-delete-btn" onClick={this.resetregdLastName} type="button">X</button>
              <hr className="hr-width hr noPadding"></hr>

              <label className="asset-label" id="user-mob-num">Mobile number:</label>
              <input id="user-mob-num-input" className="input-box" onChange={this.updateStateALL} value={this.state.mobileNumber} name="mobileNumber" />
              <button id="dlt-btn-mobile" className="delete-button regd-delete-btn" onClick={this.resetregdMobile} type="button">X</button>
              <hr className="hr-width hr noPadding"></hr>

              <label className="asset-label" id="user-pan-id">PAN ID:</label>
              <input id="user-pan-id-input" className="input-box" onChange={this.updateStateALL} value={this.state.panID} name="panID" />
              <button id="dlt-btn-PAN" className="delete-button regd-delete-btn" onClick={this.resetregdPAN} type="button">X</button>
              <hr className="hr-width hr noPadding"></hr>

              <label className="asset-label" id="user-pwd-regd">New Password:</label>
              <input id="user-pwd-regd-input" type="password" className="input-box" onChange={this.updateStateALL} value={this.state.password} name="password" />
              <button id="dlt-btn-pwd" className="delete-button regd-delete-btn" onClick={this.resetregdPwd} type="button">X</button>
              <hr className="hr-width hr noPadding"></hr>

              <label className="asset-label" id="user-pwd-conf">Confirm Password:</label>
              <input id="user-pwd-conf-input" type="password" className="input-box" onChange={this.updateStateALL} value={this.state.confirmPassword} name="confirmPassword" />
              <button id="dlt-btn-conf-Pwd" className="delete-button regd-delete-btn" onClick={this.resetregdConfPwd} type="button">X</button>
              <hr className="hr-width hr noPadding"></hr>

              <button className="Button-style" id="user-submit-btn" type="button" onClick={this.submitClick}>Submit</button>
            </form>
          </div>

        </div>
        <Modal show={this.state.showModal} onHide={this.closeModal} >
          <Modal.Header closeButton className="custom-modal" >
            <Modal.Title>Congratulations {this.state.firstName}<br /> Registration successful !!!</Modal.Title>
            <Link to="AssetRegister"><button id="user-regd-ok-btn" type="button" >Ok</button></Link>
          </Modal.Header>
        </Modal>
      </div>
    );
  }
}

export default RegistrationForm;



//////// Deleted codes***************......................//////////

//***********LEFT PANNEL BOX***********************
// <div id="userBox1" className="col-md-5">
//   <div id="row">
//     >>> To register as a new user please enter your details as required and click submit
//             </div>
//   <div id="userBox2">
//     <span id="welcome-user"> Hello,<br /> {this.state.firstName}</span>
//   </div>
// </div>
//***********LEFT PANNEL BOX***********************
