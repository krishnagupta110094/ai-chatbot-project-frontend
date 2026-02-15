import "./App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import AppRoutes from "./AppRoutes";
import { clearAuth, setAuth } from "./redux/slices/authSlice";

// cookies automatically send hon
// axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        // console.log("Auth check response:", res);
        if (res.data?.user) {
          // console.log("Authenticated user:", res.data.user);
          dispatch(setAuth(res.data.user));
        } else {
          dispatch(clearAuth());
        }
      } catch (error) {
        dispatch(clearAuth());
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;
