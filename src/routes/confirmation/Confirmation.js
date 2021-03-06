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
import s from './Confirmation.scss';
import Link from '../../components/Link';

function Confirmation({ title }) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{title}</h1>
        <div>
          <h3>You are voting for</h3>
        </div>
        <img src={require('./6-Sydney.png')} width="256" height="256" alt="City" className={s.confirmImage}/>
        <div> 
          <h2>Sydney</h2>
        </div>
          <Link to="/success" className={s.noUnderline}><div type="button" className={s.buttonPrimary} name="confirm">Confirm</div></Link>
          <Link to="/vote" className={s.noUnderline}><div type="button" className={s.buttonPrimary} name="back">Back</div></Link>
      </div>
    </div>
  );
}

Confirmation.propTypes = { title: PropTypes.string.isRequired };

export default withStyles(Confirmation, s);
