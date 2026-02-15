import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../redux/slices/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearChats } from "../redux/slices/chatSlice";

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  // get first letter of firstName
  const firstLetter = user?.fullName?.firstName?.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://ai-chatbot-backend-oqdi.onrender.com/api/auth/logout",
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      dispatch(clearAuth()); // redux clear
      dispatch(clearChats()); // clear chats on logout
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Profile Icon */}
      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg cursor-pointer">
        {firstLetter}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md  transition"
      >
        <i class="ri-logout-box-r-line"></i>
      </button>
    </div>
  );
};

export default ProfileMenu;
