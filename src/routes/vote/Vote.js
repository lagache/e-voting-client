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

function Vote({ election }) {
	return (
	    <div className={s.root}>
	      <div className={s.container}>
	        <h1>Vote Here</h1>
	        <h2>Select a Party</h2>
	        <Parties data={election.parties}/>
	        <h2>Select a Candidate</h2>
	        <Candidates data={election.candidates}/>
	      </div>
	    </div>
	);
}



Vote.propTypes = { election: PropTypes.object.isRequired };

export default withStyles(Vote, s);
