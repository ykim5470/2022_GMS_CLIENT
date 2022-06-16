import React from 'react';
import style from './Setting.module.css'

import { useSelector, useDispatch } from 'react-redux'


const Setting = ({ handleSetting, videoSelect, audioInputSelect, audioOutputSelect }) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const mediaConstraintsState = state.mediaConstraints

  console.log('audioInputSelect', audioInputSelect)
  console.log('audioOutputSelect', audioOutputSelect)
  console.log('videoSelect', videoSelect)


  return (
    <div className={style.container} onClick={handleSetting}>
      <div className={style.modal_window} onClick={(e) => e.stopPropagation()}>
        <h1>hallo setting</h1>
        <div>카메라
          <select name="video_quality" id="">
            {videoSelect.map(el => {
              // console.log(el.deviceId)
              <option value={el}>{el}</option>
            })}
          </select>
        </div>
        <div>마이크
          <select name="microphon" id=""></select>
        </div>
        <div>오디오/스피커
          <select name="fram_rate" id=""></select>
        </div>
      </div>
      <button>취소</button>
      <button>저장</button>
    </div>
  );
};

export default Setting;
