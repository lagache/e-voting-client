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
import s from './Success.scss';
import Link from '../../components/Link';

function Success({ title }) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{title}</h1>
        <img src={require('./success.png')} width="128" height="128" alt="Success" className={s.successImage}/>
        <div>
          <h2>Thank-you for voting</h2>
        </div>
        <div>
          <h4>You may now close this window</h4>
        </div>
      </div>
    </div>
  );
}

Success.propTypes = { title: PropTypes.string.isRequired };

export default withStyles(Success, s);
