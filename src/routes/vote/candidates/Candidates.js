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
import s from './Candidates.scss';

function Candidates({ data }) {
	let candidateOptions;
	if(data){
		candidateOptions = data.map(function(candidate){
			return (
				<option key={candidate.id} id={candidate.id} value={candidate.id}>{candidate.name}</option>
			);
		});
	}

	return (
	    <div className={s.root}>
	    	<select id="candidateOptions">
	    		<option disabled selected value> -- select an option -- </option>
	    		{candidateOptions}
	    	</select>
	    </div>
	);
}

export default withStyles(Candidates, s);
