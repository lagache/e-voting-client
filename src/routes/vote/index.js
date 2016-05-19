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
  	  	id:'P0001',
  	  	name:'Green Party'
  	  },
  	  {
  	  	id:'P0002',
  	  	name:'Aubergine Party'
  	  },
  	  {
  	  	id:'P0003',
  	  	name:'Party Party'
  	  }
  	],
    candidates: [
      {
        id:'C0001',
        name:'John Key',
        partyId:'P0001'
      },
      {
        id:'C0002',
        name:'Ron Burgendy',
        partyId:'P0003'
      },
      {
        id:'C0003',
        name:'Dawie Olivier',
        partyId:'P0002'
      }
    ]
  }
  return <Vote election={electionData} />;
};
