import { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/slices/authSlice";

export default function Login() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let formatUserData = {};

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    axios.post("/api/auth/login", {
      email: form.email,
      password: form.password,
    },
  {    withCredentials: true,
  })
    .then((response) => {
      console.log("Login successful:", response.data);
      // Handle successful login (e.g., redirect, store token, etc.)
      //format user data as per backend response
      formatUserData = {
        email: response.data.email,
        fullName: {
          firstName: response.data.fullName.firstName,
          lastName: response.data.fullName.lastName,
        },
        _id: response.data._id,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
      }
      dispatch(setAuth(formatUserData)); // Update auth state in Redux
      navigate("/chat");
    })
    .catch((error) => {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      alert("Login failed: " + (error.response ? error.response.data.message : error.message));
    });
    setForm({
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              required={true}
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required={true}
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 font-medium cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
