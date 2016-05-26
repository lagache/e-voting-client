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
import home from './Home.scss';

function Home({ news }) {
  return (
    <div className={home.root}>
      <div className={home.container}>
        <h1 className={home.title}>How to vote online</h1>

        <ul className={home.items}>
            <li className={home.item}>
              <div className={home.itemTitle}>Get your username </div>
              <div className={home.itemDesc}> You will find it in your voting package you received by mail </div>
            </li>
            <li className={home.item}>
              <div className={home.itemTitle}>Get your password </div>
              <div className={home.itemDesc}> You will find it in the dedicated mail we sent you </div>
            </li>
            <li className={home.item}>
              <div className={home.itemTitle}>Log in to the e-voting platform </div>
              <div className={home.itemDesc}> And then follow the instructions on the screen (will take approximatively 2-3 minutes) </div>
            </li>
        </ul>

      </div>
    </div>
  );
}

Home.propTypes = {
  news: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    contentSnippet: PropTypes.string,
  })).isRequired,
};

export default withStyles(Home, home);
