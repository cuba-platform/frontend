import {Icon} from 'antd';
import Centered from './common/Centered';
import * as React from 'react';
import './CenteredLoader.css';

export class CenteredLoader extends React.Component {
  render() {
    return (
      <Centered>
        <Icon type="loading" className='centered-loader-icon' spin={true}/>
      </Centered>
    );
  }
}
