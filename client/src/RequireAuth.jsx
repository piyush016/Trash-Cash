import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { tokenState } from "./atoms/userState";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const token = useRecoilValue(tokenState);

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  return children;
};

export default RequireAuth;
