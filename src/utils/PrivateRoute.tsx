import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  return user ? <>{children}</> : <Navigate to="/Login" />;
}

export default PrivateRoute;