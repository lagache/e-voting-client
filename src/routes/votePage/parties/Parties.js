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
import s from './Parties.scss';
import Party from './party/Party';

function Parties({ data }) {
	let partyOptions;
	if(data){
		partyOptions = data.map(function(party){
			return (
				<option key={party.party_id} id={party.party_id} value={party.party_id}>{party.party_name}</option>
			);
		});
	}

	return (
	    <div className={s.root}>
	    	<select id="partyOptions">
	    		<option disabled selected value> -- select an option -- </option>
	    		{partyOptions}
	    	</select>
	    </div>
	);
}

export default withStyles(Parties, s);
