import { Layout, Menu, Avatar, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faMoneyBillTransfer,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const { Sider } = Layout;

const SideNavigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    notification.success({
      message: "Bye",
      description: "See you soon!",
    });
  };

  return (
    <Sider collapsed={true} style={{ background: "#fff" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "16px 0",
        }}
      >
        <Avatar size={40} icon={<FontAwesomeIcon icon={faUser} />} />
      </div>
      <Menu theme='light' mode='inline'>
        <Menu.Item key='1' icon={<FontAwesomeIcon icon={faChartBar} />}>
          <Link to='/dashboard' style={{ margin: "0 8px" }}>
            Dashboard
          </Link>
        </Menu.Item>
        <Menu.Item
          key='2'
          icon={<FontAwesomeIcon icon={faMoneyBillTransfer} />}
        >
          <Link to='/send-money' style={{ margin: "0 8px" }}>
            Send Money
          </Link>
        </Menu.Item>
        <Menu.Item key='3' icon={<FontAwesomeIcon icon={faUser} />}>
          <Link to='/profile' style={{ margin: "0 8px" }}>
            Profile
          </Link>
        </Menu.Item>
        <Menu.Item
          key='4'
          icon={<FontAwesomeIcon icon={faSignOutAlt} />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SideNavigation;
