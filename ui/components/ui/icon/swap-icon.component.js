import React from 'react';
import PropTypes from 'prop-types';

export default function SwapIcon({
  width = '13',
  height = '16',
  color = 'white',
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.1123 4.33368H12.1875M4.27664 8.02541L1.1123 11.1897L4.27664 14.3541V8.02541ZM12.1875 11.1897H1.1123H12.1875ZM9.02315 1.16934L12.1875 4.33368L9.02315 7.49802V1.16934Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </svg>
  );
}

SwapIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  color: PropTypes.string,
};
