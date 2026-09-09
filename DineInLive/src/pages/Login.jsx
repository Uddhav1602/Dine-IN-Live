import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Login States
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  /* ========= LOGIN ========= */
  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    if (!loginUsername || !loginPassword) {
      setErrorMsg("Please enter username and password.");
      return;
    }

    setLoginLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          username: loginUsername,
          password: loginPassword,
        },
        {
          withCredentials: true,
        }
      );

      // JWT is now handled through the authentication cookie.
      // No authentication data is stored in localStorage.

      navigate("/search");
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  /* ========= SIGNUP ========= */
  const handleSignup = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    if (!username || !email || !phone || !address || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    setSignupLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          username,
          email,
          phone,
          address,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setIsSignUp(false);

      setUsername("");
      setEmail("");
      setPhone("");
      setAddress("");
      setPassword("");

      setSuccessMsg(res.data.message);

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error || "Signup failed"
      );
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/thali.jpg')] bg-cover bg-center p-4">
      {/* Dark Overlay for background image readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 overflow-hidden w-full max-w-[768px] min-h-[550px] bg-white rounded-[30px] shadow-2xl flex flex-col md:block">

        {/* ============ MOBILE TAB SWITCHER (Hidden on MD+) ============ */}
        <div className="flex md:hidden w-full z-50 bg-white">
          <button
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-4 text-base font-bold transition-colors duration-300 ${
              !isSignUp
                ? "bg-[#D2691E] text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-4 text-base font-bold transition-colors duration-300 ${
              isSignUp
                ? "bg-[#D2691E] text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* ============ SIGN UP FORM ============ */}
        <div
          className={`
            md:absolute md:top-0 md:h-full md:w-1/2 md:left-0 md:transition-all md:duration-700 md:ease-in-out
            flex-1 w-full p-6 sm:p-10
            ${
              isSignUp
                ? "md:translate-x-full md:opacity-100 md:z-50 block"
                : "md:opacity-0 md:z-0 hidden md:block"
            }
          `}
        >
          <form
            onSubmit={handleSignup}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-[#8B4513]">
              Create Account
            </h1>

            {errorMsg && isSignUp && (
              <div className="w-full bg-red-50 border border-red-300 text-red-700 text-xs sm:text-sm px-3 py-2 rounded-lg mb-3">
                {errorMsg}
              </div>
            )}

            <input
              className="input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="input text-sm md:text-base"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="input text-sm md:text-base"
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="input text-sm md:text-base"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input
              type="password"
              className="input text-sm md:text-base"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={signupLoading}
              className="btn mt-4 disabled:opacity-60"
            >
              {signupLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* ============ SIGN IN FORM ============ */}
        <div
          className={`
            md:absolute md:top-0 md:h-full md:w-1/2 md:left-0 md:transition-all md:duration-700 md:ease-in-out
            flex-1 w-full p-6 sm:p-10
            ${
              isSignUp
                ? "md:translate-x-full md:opacity-0 hidden md:block"
                : "md:opacity-100 md:z-20 block"
            }
          `}
        >
          <form
            onSubmit={handleLogin}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-[#8B4513]">
              Sign In
            </h1>

            {successMsg && (
              <div className="w-full bg-green-50 border border-green-300 text-green-700 text-xs sm:text-sm px-3 py-2 rounded-lg mb-3">
                ✅ {successMsg}
              </div>
            )}

            {errorMsg && !isSignUp && (
              <div className="w-full bg-red-50 border border-red-300 text-red-700 text-xs sm:text-sm px-3 py-2 rounded-lg mb-3">
                {errorMsg}
              </div>
            )}

            <input
              className="input text-sm md:text-base"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />

            <input
              type="password"
              className="input text-sm md:text-base"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <div className="my-2 text-sm text-gray-500 hover:text-[#D2691E] cursor-pointer">
              Forgot your password?
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="btn mt-4 disabled:opacity-60"
            >
              {loginLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* ============ OVERLAY CONTAINER (Hidden on Mobile) ============ */}
        <div
          className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100]
          ${isSignUp ? "-translate-x-full" : ""}`}
        >
          <div
            className={`bg-gradient-to-r from-[#D2691E] to-[#8B4513] text-white h-full w-[200%] relative -left-full transition-transform duration-700 ease-in-out
            ${isSignUp ? "translate-x-1/2" : ""}`}
          >
            {/* OVERLAY LEFT (Shown when Right Panel is Active) */}
            <div className="absolute top-0 w-1/2 h-full flex flex-col items-center justify-center px-10 text-center transform translate-x-0 transition-transform duration-700">
              <h1 className="text-3xl font-bold mb-4">
                Welcome Back!
              </h1>

              <p className="mb-8">
                To keep connected with your favorite mess, please login with
                your personal info.
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="overlay-btn"
              >
                Sign In
              </button>
            </div>

            {/* OVERLAY RIGHT (Shown when Left Panel is Active) */}
            <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-10 text-center transform translate-x-0 transition-transform duration-700">
              <h1 className="text-3xl font-bold mb-4">
                Hello, Foodie!
              </h1>

              <p className="mb-8">
                Enter your personal details and start your journey with us.
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="overlay-btn"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Styled JSX for scoped styles */}
      <style>{`
        .input {
          width: 100%;
          padding: 12px 15px;
          margin: 8px 0;
          border-radius: 8px;
          background: #fdfbf7;
          border: 1px solid #e0d0c0;
          outline: none;
          transition: 0.3s;
        }

        .input:focus {
          border-color: #D2691E;
          background: #fff;
        }

        .btn {
          background: #D2691E;
          color: white;
          padding: 12px 45px;
          border-radius: 25px;
          font-weight: bold;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: transform 80ms ease-in, background 0.3s;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .btn:hover:not(:disabled) {
          background: #8B4513;
        }

        .btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .overlay-btn {
          background: transparent;
          border: 1px solid white;
          color: white;
          padding: 12px 45px;
          border-radius: 25px;
          font-weight: bold;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: transform 80ms ease-in;
        }

        .overlay-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default Login;