import * as React from "react"
import { SVGProps } from "react"
const DashboardLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
  >
    <rect width={50} height={50} fill="#C6EF42" rx={5.859} />
    <path
      fill="#144419"
      d="M12.549 27.097c0 .758.591 1.302 1.376 1.302h9.746l-5.076 13.367c-.749 1.944 2.1 3.383 3.402 1.813l14.944-19.498c.318-.392.482-.769.482-1.183 0-.767-.589-1.314-1.383-1.314H26.3L32.35 8.911c.748-1.937-2.24-3.658-3.551-2.094L13.024 25.914c-.318.383-.475.76-.475 1.183Z"
    />
  </svg>
)
export default DashboardLogo
