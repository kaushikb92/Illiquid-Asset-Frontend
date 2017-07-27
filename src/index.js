import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { Router, Route, browserHistory, IndexRoute  } from 'react-router'
import Home from './home'
import UserProfile from './userProfile'
import MarketPlace from './marketPlace'
import RegistrationForm from './registrationForm'
import AssetRegistration from './AssetRegister'
import AssetView from './assetView'
import BlockExplorer from './BlockExplorer'
import Statement from './statement'



ReactDOM.render((
   <Router history = {browserHistory}>
      <Route path = "/" component = {App}>
         <IndexRoute component = {Home} />
         <Route path = "Home" component = {Home} />
         <Route path = "assetRegister" component = {AssetRegistration} />
         <Route path = "marketPlace" component = {MarketPlace} />
         <Route path = "AssetView" component = {AssetView} />
         <Route path = "Statement" component = {Statement} />
         <Route path = "userProfile" component = {UserProfile} />     
         <Route path = "BlockExplorer" component = {BlockExplorer} />
         


      </Route>
   </Router>

), document.getElementById('root'))
