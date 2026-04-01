export const ShoppingCartSimple = ({ color = "currentColor", className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M4 5h2l1.5 9h11L21 8H8"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="19" r="1.25" fill={color} />
    <circle cx="17" cy="19" r="1.25" fill={color} />
  </svg>
);
