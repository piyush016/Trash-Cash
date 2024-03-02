const headingStyle = {
  fontWeight: "bold",
  fontSize: "24px",
  paddingTop: "12px",
};

export default function Heading({ label }) {
  return <div style={headingStyle}>{label}</div>;
}
