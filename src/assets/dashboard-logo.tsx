import * as React from "react"
import { SVGProps } from "react"
const DashboardLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="none"
  >
    <rect width={32} height={32} fill="#C6EF42" rx={3.75} />
    <path
      fill="#144419"
      d="M8.031 17.342c0 .485.379.833.881.833h6.237l-3.248 8.555c-.48 1.244 1.344 2.165 2.177 1.16l9.564-12.478c.204-.25.309-.492.309-.757 0-.491-.377-.841-.886-.841h-6.232l3.87-8.11c.48-1.24-1.433-2.342-2.273-1.341L8.336 16.585c-.204.245-.305.486-.305.757Z"
    />
  </svg>
)
export default DashboardLogo
