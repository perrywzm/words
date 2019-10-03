import React from 'react';
import './PositionBar.css';

const PositionBar = ({position}) => {
  const posClass = getPositionClass(position);

  return <div className={`pos-container ${posClass}`}>{posClass.toUpperCase()}</div>
}

const getPositionClass = (position) => {
  switch(position) {
    case 0:
      return "first";
    case 1:
      return "second";
    case 2:
      return "third";
    default:
      return "";
  }
} 

export default PositionBar;