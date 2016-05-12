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
import s from './Login.scss';

function Login({ title }) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{title}</h1>
        <p>Log in to the e-voting platform</p>
        <div>
        	<input type="text" id="username" placeholder="username" tabIndex="1"/>
        </div>
        <div>
        	<input type="text" id="password" placeholder="password" tabIndex="2"/>
        </div>
        	<div type="button" className={s.button} name="login">Login</div>
      </div>
    </div>
  );
}

Login.propTypes = { title: PropTypes.string.isRequired };

export default withStyles(Login, s);
