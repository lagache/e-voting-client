/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoginPage.scss';

function submitLogin(){
// function submitLogin(loginString){
	// let xhr = new XMLHttpRequest();
	// xhr.withCredentials = true;

	// xhr.addEventListener("readystatechange", function () {
	// 	if (this.readyState === 4) {
	// 		console.log(this.responseText);
	// 	}
	// });

	// xhr.open("POST", "http://localhost:3001/api/election/login/v1", false);
	// xhr.setRequestHeader("cache-control", "no-cache");
	// xhr.setRequestHeader("postman-token", "ca5c5c4e-7436-c347-c2f3-52cfb0e5376e");
	// xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

	// let data = 'loginString='+loginString;
	// xhr.send(data);

	// if (xhr.status == 200) {
	// 	alert('log in successful');
		window.location = '/votePage';
	// } else {
	// 	alert('log in unsuccessful');
	// }
}

function LoginPage({ title }) {
	return (
	    <div className={s.root}>
	      	<div className={s.container}>
	      		<h1>Log in</h1><br />
	      		<h4>Login PIN</h4><input id='pinInput' className={s.inputField} type='PIN' /><br />
	      		<h4>Login Password</h4><input id='passwordInput' className={s.inputField} type='password' /><br />
	      		<div className={s.container}><button className={s.buttonPrimary} onClick={
	      			function(){
		        		// let loginString=document.getElementById("loginStringInput").value;
		        		// if(loginString){
		        			// submitLogin(loginString);
		        		// } else {
		        		// 	alert('enter your login words');
		        		// }
		        	}
		    	}>Log in</button></div>

	    	</div>
	    </div>
	);
}

// document.getElementById("myTextbox").focus(); 

LoginPage.propTypes = { title: PropTypes.string.isRequired };

export default withStyles(LoginPage, s);
