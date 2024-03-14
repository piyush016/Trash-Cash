import { Layout } from "antd";
import "./Nav.css";

const { Header } = Layout;

const Nav = () => {
  return (
    <Header className='nav-header'>
      <div className='logo'>
        <h1>Trash Cash</h1>
      </div>
    </Header>
  );
};

export default Nav;
