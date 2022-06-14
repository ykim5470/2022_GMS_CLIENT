import React from 'react';
import style from './SideBar.module.css'

import Landing from '../webrtc/guide/Landing';

const SideBar = () => {
  return (
    <div className={style.container}>
      <div className={style.head_text}>side bar</div>
      <Landing />
    </div>
  );
};

export default SideBar;