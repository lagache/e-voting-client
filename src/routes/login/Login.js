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
import Link from '../../components/Link';

function Login({ title }) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{title}</h1>
        <div>
          <h4>Username</h4>
        	<input type="text" id="username" placeholder="Username" tabIndex="1" className={s.inputField} />
        </div>
        <div>
          <h4>Password</h4>
        	<input type="password" id="password" placeholder="Password" tabIndex="2" className={s.inputField}/>
        </div>
          <Link to="/vote" className={s.noUnderline}><div type="button" className={s.buttonPrimary} name="login">Login</div></Link>
      </div>
    </div>
  );
}

Login.propTypes = { title: PropTypes.string.isRequired };

export default withStyles(Login, s);
