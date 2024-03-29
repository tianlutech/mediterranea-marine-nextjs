import * as React from "react";
const InfoSvg = ({ width, height }: { width?: number; height?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width || 16}
    height={height || 16}
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M6.5 11.5H8M9.5 11.5H8M8 11.5V7.5H6.5M8.5 5C8.5 5.27614 8.27614 5.5 8 5.5C7.72386 5.5 7.5 5.27614 7.5 5C7.5 4.72386 7.72386 4.5 8 4.5C8.27614 4.5 8.5 4.72386 8.5 5Z"
      stroke="#6C727F"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx={8} cy={8} r={6.5} stroke="#6C727F" />
  </svg>
);
export default InfoSvg;
