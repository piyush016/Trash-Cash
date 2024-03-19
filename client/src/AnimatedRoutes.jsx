import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import Dashboard from "./screens/Dashboard";
import Passbook from "./screens/Passbook";
import SendMoney from "./screens/SendMoney";
import Profile from "./screens/Profile";
import Expenses from "./screens/Expenses";
import Loan from "./screens/Loan";
import { AnimatePresence } from "framer-motion";
// import {} from "framer-motion/dist/framer-motion";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route exact path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/passbook' element={<Passbook />} />
        <Route path='/send-money' element={<SendMoney />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/expenses' element={<Expenses />} />
        <Route path='/loan' element={<Loan />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
