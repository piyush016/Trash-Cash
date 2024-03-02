const inputBoxStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  paddingBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #CBD5E0",
  borderRadius: "5px",
};

export default function InputBox({ label, placeholder, type, onChange }) {
  return (
    <div style={inputBoxStyle}>
      <div style={labelStyle}>{label}</div>
      <input
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        style={inputStyle}
      />
    </div>
  );
}
