import React, { useRef, useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

const RECAPTCHA_SITE_KEY = "6LcdX1UrAAAAADBJOJlAhFDKETkIGHknDsuDiT9I";

const LoginForm = () => {
  const recaptchaRef = useRef();
  const navigate = useNavigate();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    captchaToken: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
    setFormData((prev) => ({
      ...prev,
      captchaToken: value,
    }));

    // Clear captcha error if exists
    if (errors.captcha) {
      setErrors((prev) => ({ ...prev, captcha: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Email or username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    // if (!captchaVerified) {
    //   newErrors.captcha = "Please complete the CAPTCHA";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log(formData);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/api/v1/login`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Store token or user data as needed
        toast.success("Login successful!");
        navigate("/dashboard"); // Redirect to dashboard or home page
      } else {
        setErrors({
          general:
            response.data.message || "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
      setErrors({
        general: "An error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/api/v1/auth/google`,
        { token },
        { withCredentials: true }
      );

      if (res.data.token) {
        navigate("/dashboard");
      } else {
        setErrors({ general: "Google sign-in failed. Try again." });
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setErrors({ general: "Google sign-in error. Please try again." });
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 transition-all duration-300 hover:shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="emailOrUsername"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email or Username
              </label>
              <input
                type="text"
                id="emailOrUsername"
                name="emailOrUsername"
                placeholder="john@example.com or johndoe"
                required
                value={formData.emailOrUsername}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.emailOrUsername ? "border-red-500" : "border-gray-300"
                } rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition`}
              />
              {errors.emailOrUsername && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.emailOrUsername}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition pr-10`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>

            {/* <div className="mt-4">
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                  ref={recaptchaRef}
                />
              </div>
              {errors.captcha && (
                <p className="mt-1 text-sm text-red-600 text-center">
                  {errors.captcha}
                </p>
              )}
            </div> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/s"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-3 text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrors({ general: "Google login failed" })}
            />
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginForm;
