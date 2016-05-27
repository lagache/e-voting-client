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
import s from './Vote.scss';
import Parties from './parties/Parties.js';
import Candidates from './candidates/Candidates.js';
import Link from '../../components/Link';

function sendVote(voteData){
	let data = voteData;

	let xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
	    console.log(this.responseText);
	  }
	});

	xhr.open("POST", "/api/election/vote/v1");
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.setRequestHeader("postman-token", "ca5c5c4e-7436-c347-c2f3-52cfb0e5376e");
	xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

	xhr.send(data);
	// alert('data : ' + data);
}

function Vote({ election }) {
	return (
	    <div className={s.root}>
	      <div className={s.container}>
	        <h1>Vote Here</h1>
	        <h2>Select a Party</h2>
	        <Parties data={election.options}/>
	        <br/>
	        <div className={s.container}><button className={s.root} onClick={function(){
	        		let partyOptionSelected=document.getElementById("partyOptions").value;
	        		sendVote('option1='+partyOptionSelected);
	        	}}>Submit</button></div>
	      </div>

          <Link to="/confirmation"><div type="button" className={s.buttonPrimary} name="confirm">Confirm</div></Link>
	    </div>
	);
}

Vote.propTypes = { election: PropTypes.object.isRequired };

export default withStyles(Vote, s);
