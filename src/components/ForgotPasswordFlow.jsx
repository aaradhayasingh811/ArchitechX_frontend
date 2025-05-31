
import React, { useState } from "react";
import axios from "axios";
import Footer from "./Footer";
const ForgotPasswordFlow = () => {
  // Steps: "email" -> "otp" -> "reset"
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const isPasswordStrong = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    // to check baad me delete krna h
    setMessage("OTP sent to your email.");
        setStep("otp");
    // 
    // try {
    //   setLoading(true);
    //   const res = await axios.post("/api/forgot-password/send-otp", { email });

    //   if (res.data.success) {
    //     setMessage("OTP sent to your email.");
    //     setStep("otp");
    //   } else {
    //     setError(res.data.message || "Failed to send OTP.");
    //   }
    // } catch (err) {
    //   setError("An error occurred. Please try again.");
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    // to check baad me delete krna h
    setMessage("OTP verified. Please set your new password.");
        setStep("reset");
    // 

    // try {
    //   setLoading(true);
    //   const res = await axios.post("/api/forgot-password/verify-otp", {
    //     email,
    //     otp,
    //   });

    //   if (res.data.success) {
    //     setMessage("OTP verified. Please set your new password.");
    //     setStep("reset");
    //   } else {
    //     setError(res.data.message || "Invalid OTP.");
    //   }
    // } catch (err) {
    //   setError("An error occurred. Please try again.");
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isPasswordStrong(password)) {
      setError(
        "Password must be min 8 chars, include uppercase, lowercase, number, and special char."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
            // 
    setMessage("Password reset successful! Redirecting to login...");
    window.location.href = "/login";
// 

    // try {
    //   setLoading(true);
    //   const res = await axios.post("/api/forgot-password/reset-password", {
    //     email,
    //     otp,
    //     password,
    //   });

    //   if (res.data.success) {
    //     setMessage("Password reset successful! Redirecting to login...");
    //     setTimeout(() => {
    //       window.location.href = "/login"; // or use your router redirect
    //     }, 2500);
    //   } else {
    //     setError(res.data.message || "Failed to reset password.");
    //   }
    // } catch (err) {
    //   setError("An error occurred. Please try again.");
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-6">
        {step === "email" && (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Forgot Password
            </h2>
            <form onSubmit={handleSendOtp} className="space-y-5">
              <input
                type="email"
                name="email"
                placeholder="Enter your registered email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              {message && (
                <p className="text-green-600 text-sm text-center">{message}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 text-sm rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Enter OTP
            </h2>
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
                maxLength={6}
                pattern="\d{6}"
                inputMode="numeric"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm tracking-widest text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              {message && (
                <p className="text-green-600 text-sm text-center">{message}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 text-sm rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}

        {step === "reset" && (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Reset Password
            </h2>
            <form onSubmit={handleResetPassword} className="space-y-5">
              <input
                type="password"
                name="password"
                placeholder="New Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500">
                Password must include uppercase, lowercase, number, special char, and minimum 8 characters
              </p>
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              {message && (
                <p className="text-green-600 text-sm text-center">{message}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 text-sm rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
      <Footer/>
      </>
  );
};

export default ForgotPasswordFlow;
