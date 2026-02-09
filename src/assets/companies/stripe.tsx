import * as React from "react"
import { SVGProps } from "react"
const Stripe = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
  >
    <g fillRule="evenodd" clipPath="url(#a)" clipRule="evenodd">
      <path fill="#635BFF" d="M0 0h40v40H0V0Z" />
      <path
        fill="#fff"
        d="M18.44 15.55c0-.94.77-1.31 2.05-1.31 1.84 0 4.16.56 6 1.55v-5.68C24.48 9.31 22.5 9 20.5 9c-4.91 0-8.17 2.56-8.17 6.84 0 6.67 9.19 5.61 9.19 8.49 0 1.11-.97 1.47-2.32 1.47-2.01 0-4.57-.82-6.6-1.93v5.75c2.25.97 4.52 1.38 6.6 1.38 5.03 0 8.49-2.49 8.49-6.82-.04-7.2-9.25-5.92-9.25-8.63Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h40v40H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default Stripe
