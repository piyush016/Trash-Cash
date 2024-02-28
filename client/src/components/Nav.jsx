import { Layout } from "antd";
import "./Nav.css";

const { Header } = Layout;

const Nav = () => {
  return (
    <Header className='nav-header'>
      <div className='flex justify-center md:justify-start'>
        <h1 className='text-white font-bold logo'>Trash Cash</h1>
      </div>
    </Header>
  );
};

export default Nav;
