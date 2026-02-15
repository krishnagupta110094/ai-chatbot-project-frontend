import { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/slices/authSlice";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  let formatUserData = {};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log(form);
    // from backend->>>>  const {
    //   email,
    //   fullName: { firstName, lastName },
    //   password,
    // } = req.body;
    axios
      .post(
        "http://localhost:3000/api/auth/register",
        {
          email: form.email,
          fullName: {
            firstName: form.firstName,
            lastName: form.lastName,
          },
          password: form.password,
        },
        { withCredentials: true },
      )
      .then((response) => {
        console.log("Registration successful:", response.data);
        // Handle successful registration (e.g., redirect, show message, etc.)
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
        navigate("/chat"); // no need to login after registration,directly navigate to chatpage
      })
      .catch((error) => {
        console.error(
          "Registration failed:",
          error.response ? error.response.data : error.message,
        );
        alert(
          "Registration failed: " +
            (error.response ? error.response.data.message : error.message),
        );
      });

    setForm({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={handleChange}
          />

          {/* First Name */}
          <Input
            label="First Name"
            type="text"
            name="firstName"
            placeholder="John"
            required
            value={form.firstName}
            onChange={handleChange}
          />

          {/* Last Name */}
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Doe"
            required
            value={form.lastName}
            onChange={handleChange}
          />

          {/* Password */}
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            required
            value={form.password}
            onChange={handleChange}
          />

          {/* Confirm Password */}
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            required
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
