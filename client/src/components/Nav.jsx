import { Layout } from "antd";
const { Header } = Layout;
import "./Nav.css";

const headerStyle = {
  backgroundColor: "#1890ff",
  display: "flex",
  justifyContent: "center",
};

const logoStyle = {
  color: "white",
  fontWeight: "bold",
  fontSize: "1.5rem",
  margin: "0",
};

const Nav = () => {
  return (
    <Header style={headerStyle}>
      <div style={{ display: "flex", justifyContent: "start" }}>
        <h1 style={logoStyle}>Trash Cash</h1>
      </div>
    </Header>
  );
};

export default Nav;
