import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import Dashboard from "./screens/Dashboard";
import SendMoney from "./screens/SendMoney";
import Profile from "./screens/Profile";
import SideNavigation from "./components/SideNavigation";
import Nav from "./components/Nav";
import Foot from "./components/Foot";
import { Layout } from "antd";
const { Content } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Nav />
        <Layout>
          <SideNavigation />
          <Content style={{ padding: "8px" }}>
            <Routes>
              <Route path='/signup' element={<Signup />} />
              <Route path='/signin' element={<Signin />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/send-money' element={<SendMoney />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
          </Content>
        </Layout>
        <Foot />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
