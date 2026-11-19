import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SecureRoute = ({ children }) => {
  const security = useSelector((state) => state.security);

  return security.validToken === true ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

export default SecureRoute;
