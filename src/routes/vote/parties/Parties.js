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
import Party from './party/Party.js';

function Parties({ data }) {
	let partyOptions;
	if(data){
		partyOptions = data.map(function(party){
			return (
				<Party data={party} key={party.id} />
			);
		});
	}

	return (
	    <div className={s.root}>
	    	<select id="partyOptions">
	    		{partyOptions}
	    	</select>
	    </div>
	);
}

export default withStyles(Parties, s);
