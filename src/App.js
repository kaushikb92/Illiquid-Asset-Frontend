import React, { Component } from 'react'

import './App.css'
import Web3 from 'web3'
import 'bootstrap/dist/css/bootstrap.css'
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

class App extends Component {
  render() {
    return (

      <div id="whole-page" className="h100 container-fluid">


        <div className=" menuContainer h100">

          <div className="row h100 w100" >
            <div className="col-md-2 h100 noPadding">
              <div className="Heading-corner-box noPadding">
                <div className="Heading-corner-Names">

                  <span id="Co-Innovation-Lab-Name">Co-Innovation Lab</span><br />
                  <span id="Illiquid-Assets-Name">Illiquid Assets Marketplace</span>

                </div>

              </div>
              <div id="Button-list-box">
                <Link to="home"><button className="Button-style-menu home-icon" id="Home-button" >Home</button></Link><br />
                <Link to="AssetRegister"><button className="Button-style-menu assetregd-icon" id="Default-1-button" >Asset Registration</button></Link><br />
                <Link to="marketPlace" ><button className="Button-style-menu mp-icon" id="Marketplace-button" >Marketplace</button></Link><br />
                <Link to="AssetView"><button className="Button-style-menu holdings-icon" id="Default-2-button" >My Holdings</button></Link><br />  
                <Link to="Statement"><button className="Button-style-menu ledger-icon" id="Statement" >Trade Ledger</button></Link><br />
                <Link to="BlockExplorer"><button className="Button-style-menu ethereum-icon" id="BlockExplorer" >BlockExplorer</button></Link><br />  
                <Link to="UserProfile"><button className="Button-style-menu user-icon" id="User-Profile-button" >Profile</button></Link><br />
              </div>
            </div>

            {this.props.children}

          </div>


        </div>

<div className="row">
                    <div id="footer" className="col-md-10 link-color noPadding ">
                        <div className="col-md-3 center-align verticalLine">
                            <div className="underline"><h4>Who we are</h4></div>
                            <span>
                                <a href="#">Overview</a><br />
                                <a href="#">History</a><br />
                                <a href="#">Differentiators</a>
                            </ span>
                        </div>
                        <div className="col-md-4 center-align verticalLine">
                            <div className="underline"><h4>Careers</h4></div>
                            <span>
                                <a href="#">Work culture</a><br />
                                <a href="#">Learning {'&'} development</a><br />
                                <a href="#">Employee speak</a>
                            </ span>
                        </div>

                        <div className="col-md-3 center-align">
                            <div className="underline"><h4>Contact Us</h4></div>
                            <address>
                                Pune, India<br />
                                +91 1802545456<br />
                                <a href="mailto:CoInnovationLab@hcl.com">CoInnovationLab@hcl.com</a>
                            </ address>
                        </div>
                    </div>
                </div>

      </div>

    );
  }

}

export default App;
