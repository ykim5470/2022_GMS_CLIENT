import { ConstructionOutlined } from '@mui/icons-material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './NavBar.module.css'


const NavBar = () => {
  const navigate = useNavigate()
  const handleLogin = () => {
    console.log('click')
    navigate('/login')
  }
  return (
    <div className={style.container}>
      <div className={style.nav_container}>
        <div className={style.nav_head_text}>nav bar</div>
        <button className={style.login_btn} onClick={handleLogin}>login</button>
      </div>

      {/* <div className={style.side_container}>
        <div className={style.side_head_text}>side bar</div>
      </div> */}
    </div>
  );
};

export default NavBar;