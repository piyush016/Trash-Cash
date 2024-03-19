import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import Dashboard from "./screens/Dashboard";
import Passbook from "./screens/Passbook";
import SendMoney from "./screens/SendMoney";
import Profile from "./screens/Profile";
import Expenses from "./screens/Expenses";
import Loan from "./screens/Loan";
import RequireAuth from "./RequireAuth";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route exact path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route
          path='/dashboard'
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path='/passbook'
          element={
            <RequireAuth>
              <Passbook />
            </RequireAuth>
          }
        />
        <Route
          path='/send-money'
          element={
            <RequireAuth>
              <SendMoney />
            </RequireAuth>
          }
        />
        <Route
          path='/profile'
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path='/expenses'
          element={
            <RequireAuth>
              <Expenses />
            </RequireAuth>
          }
        />
        <Route
          path='/loan'
          element={
            <RequireAuth>
              <Loan />
            </RequireAuth>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
