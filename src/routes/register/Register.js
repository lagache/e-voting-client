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
import s from './Register.scss';



var Register = React.createClass({

getInitialState: function() {
    return {unlock: false};
  },

 tally: function(voteData){
 	var self = this;
	// let data = voteData;

	// let xhr = new XMLHttpRequest();
	// xhr.withCredentials = true;

	// xhr.addEventListener("readystatechange", function () {
	//   if (this.readyState === 4) {
	//     console.log(this.responseText);
	//   }
	// });

	// xhr.open("POST", "/api/election/tally/v1");
	// xhr.setRequestHeader("cache-control", "no-cache");
	// xhr.setRequestHeader("postman-token", "ca5c5c4e-7436-c347-c2f3-52cfb0e5376e");
	// xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

	// xhr.send(data);
	// console.log('data : ' + data);

	this.state.unlock = true;
	setTimeout( function() {
		self.forceUpdate();
	}, 3000);
},

	 render: function() {
  console.log(this.state.unlock);
  if(!this.state.unlock) {
  	console.log('1');
	return (
		<span className={s.root}>
		  <span className={s.container}>
		    <h1>Results of the election 0001</h1>
		     <span className={s.container}><button className={s.root} onClick={()=>this.tally('0001')}>Unlock results</button></span>
		      
		  </span>
		</span>
	);
  } else {
  	console.log('2');
	  	return (
		  	<div className={s.root}>
				  <div className={s.container}>
				    <h1>Results of the election 0001</h1>
				     <p> Here the results for election 001:</p>
				      <ul>
				      	<li> <span className={s.nameWinner}>Sydney:</span> 
				      	<span className={s.resultWinner}>12 </span>
				      	</li>
			      		<li> <span className={s.name}>London:</span> 
			      		<span className={s.result}>8 </span>
			      		</li>
	      				<li> <span className={s.name}>Auckland:</span> 
	      				<span className={s.result}>5 </span>
	      				</li>
	      				<li> <span className={s.name}>Paris:</span> 
	      				<span className={s.result}>5 </span>
	      				</li>
	      				<li> <span className={s.name}>Tokyo:</span> 
	      				<span className={s.result}>4 </span>
	      				</li>
	      				<li> <span className={s.name}>Berlin:</span>
	      				 <span className={s.result}>2 </span>
	      				</li>
	      				<li> <span className={s.name}>New york:</span>
	      				 <span className={s.result}>2 </span>
	      				</li>
	      				<li> <span className={s.name}>Shanghai:</span>
	      				 <span className={s.result}>1 </span>
	      				</li>
	      				
				      </ul>
				  </div>
				</div>
		);
	  }
	}
});

Register.propTypes = { title: PropTypes.string.isRequired };

export default withStyles(Register, s);
