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
		    <h1>Election results</h1>
		     <span className={s.container}><button className={s.buttonPrimary} onClick={()=>this.tally('0001')}>Unlock results</button></span>
		      
		  </span>
		</span>
	);
  } else {
  	console.log('2');
	  	return (
		  	<div className={s.root}>
				  <div className={s.container}>
				    <h1>Election results</h1>
				      <ul className={s.electionResults}>
				      	<li className={s.nameWinner}> 
				      		<img src={require('./img/6-Sydney.png')} width="42" height="42" alt="Sydney" className={s.resultImage}/>
				      		<span>Sydney</span> 
				      		<span className={s.resultWinner}>56</span>
				      	</li>
			      		<li className={s.name}>
			      			<img src={require('./img/1-London.png')} width="42" height="42" alt="London" className={s.resultImage}/>
			      			<span>London</span> 
			      			<span className={s.result}>54</span>
			      		</li>
	      				<li className={s.name}> 
	      					<img src={require('./img/11-Auckland.png')} width="42" height="42" alt="Auckland" className={s.resultImage}/>
	      					<span>Auckland</span> 
	      					<span className={s.result}>34</span>
	      				</li>
	      				<li className={s.name}> 
	      					<img src={require('./img/2-Paris.png')} width="42" height="42" alt="Paris" className={s.resultImage}/>
	      					<span>Paris</span> 
	      					<span className={s.result}>33</span>
	      				</li>
	      				<li className={s.name}>
	      					<img src={require('./img/7-Tokyo.png')} width="42" height="42" alt="Tokyo" className={s.resultImage}/>
	      					<span>Tokyo</span> 
	      					<span className={s.result}>27</span>
	      				</li>
	      				<li className={s.name}>
	      					<img src={require('./img/3-Berlin.png')} width="42" height="42" alt="Berlin" className={s.resultImage}/>
	      					<span>Berlin</span>
	      					<span className={s.result}>23</span>
	      				</li>
	      				<li className={s.name}>
	      					<img src={require('./img/4-NewYorkCity.png')} width="42" height="42" alt="New York City" className={s.resultImage}/>
	      					<span>New York City</span>
	      					<span className={s.result}>23</span>
	      				</li>
	      				<li className={s.name}>
	      					<img src={require('./img/8-Shanghai.png')} width="42" height="42" alt="Shanghai" className={s.resultImage}/>
	      					<span>Shanghai</span>
	      					<span className={s.result}>20</span>
	      				</li>
	      				<li className={s.name}>
	      					<img src={require('./img/5-SanFrancisco.png')} width="42" height="42" alt="SanFrancisco" className={s.resultImage}/>
	      					<span>San Francisco</span>
	      					<span className={s.result}>16</span>
	      				</li>
	      				<li className={s.name}>
	      					<img src={require('./img/9-CapeTown.png')} width="42" height="42" alt="CapeTown" className={s.resultImage}/>
	      					<span>Cape Town</span>
	      					<span className={s.result}>14</span>
	      				</li>
	      				<li className={s.name}>
	      					<img src={require('./img/10-Moscow.png')} width="42" height="42" alt="Moscow" className={s.resultImage}/>
	      					<span>Moscow</span>
	      					<span className={s.result}>12</span>
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
