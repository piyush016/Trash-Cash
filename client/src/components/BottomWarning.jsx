import { Link } from "react-router-dom";

const bottomWarningStyle = {
  padding: "8px 0",
  fontSize: "14px",
  display: "flex",
  justifyContent: "center",
};

const linkStyle = {
  cursor: "pointer",
  textDecoration: "none",
  paddingLeft: "4px",
};

export default function BottomWarning({ label, buttonText, to }) {
  return (
    <div style={bottomWarningStyle}>
      <div>{label}</div>
      <Link style={linkStyle} to={to}>
        {buttonText}
      </Link>
    </div>
  );
}
