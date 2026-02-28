import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth";

export default function ProtectedRoute({ children }) {
  const auth = isAuthenticated();
  console.log("AUTH CHECK:", auth);

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
