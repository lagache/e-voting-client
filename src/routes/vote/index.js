/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Vote from './Vote';

export const path = '/vote';
export const action = async (state) => {
  const title = 'Vote';
  state.context.onSetTitle(title);

  let electionData = {
  	parties: [
  	  {
  	  	id:'00001',
  	  	name:'Green'
  	  },
  	  {
  	  	id:'00002',
  	  	name:'Orange'
  	  },
  	  {
  	  	id:'00003',
  	  	name:'myParty'
  	  }
  	]
  }
  return <Vote election={electionData} />;
};
