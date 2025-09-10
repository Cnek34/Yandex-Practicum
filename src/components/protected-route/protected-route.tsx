import { Preloader } from "@ui";
import { getDataUser, isAuthCheckedSelector } from "../../services/slice/user-slice";
import { useSelector } from "../../services/store";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({ onlyUnAuth, children }: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(getDataUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login'/>;
  }

  if (onlyUnAuth && user) {
        const from  = location.state?.from || { pathname: '/' };
        return <Navigate replace to={from} />;
  }
  
  return children;
} 
