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

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/election/data/v1", false);
  xhr.send();

  let electionData = JSON.parse(xhr.responseText).election;

  let mockElectionData = {
  	parties: [
  	  {
  	  	party_id:'P0001',
  	  	party_name:'Green Party'
  	  },
  	  {
  	  	party_id:'P0002',
  	  	party_name:'Aubergine Party'
  	  },
  	  {
  	  	party_id:'P0003',
  	  	party_name:'Party Party'
  	  }
    ]
  }
  return <Vote election={electionData} />;
};