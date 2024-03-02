import "./App.css";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  useNavigate,
} from "react-router-dom";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import Dashboard from "./screens/Dashboard";
import SendMoney from "./screens/SendMoney";
import Profile from "./screens/Profile";
import SideNavigation from "./components/SideNavigation";
import Nav from "./components/Nav";
import Foot from "./components/Foot";
import { Layout, Modal } from "antd";
import { useState, useEffect } from "react";
const { Content } = Layout;

function ProtectedRoute({ element }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <>
        <Modal
          centered
          open={showModal}
          title='Unauthorized accesss'
          onOk={() => navigate("/signin")}
          onCancel={handleModalClose}
        >
          <div>You need to sign in to access this page.</div>
        </Modal>
      </>
    );
  }
  return element;
}

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Nav />
        <Layout>
          <SideNavigation />
          <Layout>
            <Content style={{ margin: 8, padding: 24 }}>
              <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/signin' element={<Signin />} />
                <Route
                  path='/dashboard'
                  element={<ProtectedRoute element={<Dashboard />} />}
                />
                <Route
                  path='/send-money'
                  element={<ProtectedRoute element={<SendMoney />} />}
                />
                <Route
                  path='/profile'
                  element={<ProtectedRoute element={<Profile />} />}
                />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <Foot />
    </Router>
  );
}

export default App;
