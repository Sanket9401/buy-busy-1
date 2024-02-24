import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../context/globalContext";
import { useEffect } from "react";

export default function ProtectedRoutes({ children }) {
  const { user } = useAuthValue();
  // console.log(user, "from protected");
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      return navigate("/sign-in");
    }
  }, [user, navigate]);

  return children;
}
