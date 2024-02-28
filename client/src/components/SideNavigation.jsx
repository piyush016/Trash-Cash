import React from "react";
import { Layout, Menu, Avatar } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faMoneyBillTransfer,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const { Sider } = Layout;

const SideNavigation = () => {
  return (
    <Sider collapsed={true} style={{ background: "#fff" }}>
      <div className='flex items-center justify-center m-4'>
        <Avatar size={50} icon={<FontAwesomeIcon icon={faUser} />} />
      </div>
      <Menu theme='light' mode='inline'>
        <Menu.Item key='1' icon={<FontAwesomeIcon icon={faChartBar} />}>
          <Link to='/dashboard' className='m-2'>
            Dashboard
          </Link>
        </Menu.Item>
        <Menu.Item
          key='2'
          icon={<FontAwesomeIcon icon={faMoneyBillTransfer} />}
        >
          <Link to='/send-money' className='m-2'>
            Send Money
          </Link>
        </Menu.Item>
        <Menu.Item key='3' icon={<FontAwesomeIcon icon={faUser} />}>
          <Link to='/profile' className='m-2'>
            Profile
          </Link>
        </Menu.Item>
        <Menu.Item key='4' icon={<FontAwesomeIcon icon={faSignOutAlt} />}>
          <Link to='/logout' className='m-2'>
            Logout
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SideNavigation;
