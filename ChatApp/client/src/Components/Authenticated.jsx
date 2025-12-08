import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";

const Authenticated = ({ children }) => {
  const { token } = useAuthStore();
  const isAuthenticated = Boolean(token);

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

export default Authenticated;
