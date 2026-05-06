import * as React from "react";
import { SVGProps } from "react";
const LogoLight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={24}
    fill="none"
  >
    <path
      fill="#144419"
      d="M0 13.332c0 .48.375.824.872.824h6.175l-3.217 8.47c-.474 1.231.806 1.883 1.63.889l9.994-12.094c.202-.248.305-.487.305-.75 0-.486-.372-.832-.876-.832h-6.17l3.218-8.467c.474-1.228-.805-1.88-1.636-.89L.3 12.583c-.201.243-.301.481-.301.75Z"
    />
  </svg>
)
export default LogoLight;
