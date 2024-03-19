import "./App.css";
import { Layout } from "antd";
import { RecoilRoot } from "recoil";
import Nav from "./components/Nav";
import SideNavigation from "./components/SideNavigation";
import Foot from "./components/Foot";
import { BrowserRouter as Router } from "react-router-dom";
import AnimatedRoutes from "./AnimatedRoutes";

const { Content } = Layout;

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Nav />
          <Layout>
            <SideNavigation />
            <Layout>
              <Content style={{ margin: 8, padding: 24 }}>
                <AnimatedRoutes />
              </Content>
            </Layout>
          </Layout>
          <Foot />
        </Layout>
      </Router>
    </RecoilRoot>
  );
}

export default App;
