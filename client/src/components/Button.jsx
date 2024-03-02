const buttonStyle = {
  width: "100%",
  color: "white",
  backgroundColor: "#4B5563",
  hoverBackgroundColor: "#374151",
  focusOutline: "dashed",
  focusRing: "4px",
  focusRingColor: "#CBD5E0",
  fontFamily: "Inter",
  fontWeight: "medium",
  fontSize: "14px",
  borderRadius: "8px",
  padding: "10px 20px",
  margin: "0 0 10px 0",
  border: "none",
  cursor: "pointer",
  outline: "none",
};

export default function Button({ label, onClick }) {
  return (
    <button onClick={onClick} style={buttonStyle}>
      {label}
    </button>
  );
}
