// components/icons/IconChartBar.tsx
const IconChartBar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 3v18h18" />
    <path d="M9 17V9" />
    <path d="M15 17V3" />
    <path d="M12 17V6" />
  </svg>
);
export default IconChartBar;