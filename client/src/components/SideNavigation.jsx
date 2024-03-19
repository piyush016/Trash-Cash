import { Layout, Menu, Avatar, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faMoneyBillTransfer,
  faChartPie,
  faUser,
  faSignOutAlt,
  faLandmark,
} from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tokenState } from "../atoms/userState";

const { Sider } = Layout;

const SideNavigation = () => {
  const navigate = useNavigate();
  const token = useRecoilValue(tokenState);
  const setTokenAtom = useSetRecoilState(tokenState);

  const handleLogout = () => {
    navigate("/");
    setTokenAtom("");
    notification.success({
      message: "Bye",
      description: "See you soon!",
    });
  };

  if (!token) {
    return null;
  }
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
          <Link to='/passbook' style={{ margin: "0 8px" }}>
            Passbook
          </Link>
        </Menu.Item>
        <Menu.Item key='3' icon={<FontAwesomeIcon icon={faChartPie} />}>
          <Link to='/expenses' style={{ margin: "0 8px" }}>
            Expenses
          </Link>
        </Menu.Item>
        <Menu.Item key='4' icon={<FontAwesomeIcon icon={faLandmark} />}>
          <Link to='/loan' style={{ margin: "0 8px" }}>
            Loan
          </Link>
        </Menu.Item>
        <Menu.Item key='5' icon={<FontAwesomeIcon icon={faUser} />}>
          <Link to='/profile' style={{ margin: "0 8px" }}>
            Profile
          </Link>
        </Menu.Item>
        <Menu.Item
          key='6'
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
