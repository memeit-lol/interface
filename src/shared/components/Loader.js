import React, {
  Component
} from 'react';
import { Spin, Icon } from 'antd';

/**
 * @returns {JSX} - Returns a loading symbol component.
 */
const antIcon = <Icon type="loading" style={{ fontSize: 24, margin: 'auto', display: 'block', paddingTop: 10 }} spin />;

export default antIcon;