import React from "react";

const Ycombinator = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
  >
    <g clipPath="url(#a)">
      <path fill="#FB651E" d="M40 0H0v40h40V0Z" />
      <path
        fill="#fff"
        d="M18.652 22.617 11.786 9.755h3.138l4.039 8.14c.062.145.134.295.217.45.083.155.156.316.218.482.041.062.072.119.093.17.02.052.041.099.062.14.104.207.197.41.28.606.083.197.155.378.217.544.166-.352.347-.73.544-1.134.197-.404.398-.823.606-1.258l4.1-8.14h2.92l-6.927 13.017v8.295h-2.64v-8.45Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h40v40H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default Ycombinator;
