import React from 'react';
import {Spin} from "antd";
import './Spinner.less';

export function Spinner() {

  return (
    <div className='spinner-component'>
      <Spin size="large"/>
    </div>
  );

}