import * as React from "react"
import { SVGProps } from "react"
const Flexport = (props: SVGProps<SVGSVGElement>) => (
 <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
  >
    <path fill="#052439" d="M0 0h40v40H0z" />
    <mask
      id="a"
      width={20}
      height={20}
      x={10}
      y={10}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <path fill="#fff" d="M29.995 10H10v19.99h19.995V10Z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill="#566AE4"
        d="M20.01 19.98v.025c5.514-.01 9.985-4.486 9.985-10.005h-19.26c5.184.375 9.275 4.699 9.275 9.98Z"
      />
      <path
        fill="#45DABE"
        d="M19.985 20.01c-5.281 0-9.61-4.091-9.985-9.276V29.99c5.519 0 9.995-4.466 10.01-9.985-.01.005-.02.005-.025.005Z"
      />
      <path
        fill="#fff"
        d="M19.985 20.01h.025v-.025c0-5.286-4.091-9.61-9.276-9.985H10v.734a10.009 10.009 0 0 0 9.985 9.276Z"
      />
      <path fill="#fff" d="M20.01 20.01H10V10l10.01 10.01Z" />
    </g>
  </svg>
)
export default Flexport
