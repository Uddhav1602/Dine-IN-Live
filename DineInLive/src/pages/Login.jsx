import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Login States
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  /* ========= LOGIN ========= */
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);

      navigate("/search"); // Go to search page after login
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  /* ========= SIGNUP ========= */
  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          phone,
          address,
          password
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Account created successfully! Please Sign In.");
      setIsSignUp(false); // Switch to login view
    } catch (err) {
      alert(err.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/thali.jpg')] bg-cover bg-center">
      {/* Dark Overlay for background image readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 overflow-hidden w-[768px] max-w-full min-h-[550px] bg-white rounded-[30px] shadow-2xl">

        {/* ============ SIGN UP FORM ============ */}
        <div
          className={`absolute top-0 h-full w-1/2 left-0 transition-all duration-700 ease-in-out
          ${isSignUp ? "translate-x-full opacity-100 z-50" : "opacity-0 z-0"}`}
        >
          <div className="flex flex-col items-center justify-center h-full px-10 text-center">
            <h1 className="text-3xl font-bold mb-4 text-[#8B4513]">Create Account</h1>
            
            <input className="input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
            <input className="input" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
            <input type="password" className="input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

            <button onClick={handleSignup} className="btn mt-4">Sign Up</button>
          </div>
        </div>

        {/* ============ SIGN IN FORM ============ */}
        <div
          className={`absolute top-0 h-full w-1/2 left-0 transition-all duration-700 ease-in-out
          ${isSignUp ? "translate-x-full opacity-0" : "opacity-100 z-20"}`}
        >
          <div className="flex flex-col items-center justify-center h-full px-10 text-center">
            <h1 className="text-3xl font-bold mb-4 text-[#8B4513]">Sign In</h1>
            
            <input className="input" placeholder="Username" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
            <input type="password" className="input" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            
            <div className="my-2 text-sm text-gray-500 hover:text-[#D2691E] cursor-pointer">Forgot your password?</div>
            
            <button onClick={handleLogin} className="btn mt-4">Sign In</button>
          </div>
        </div>

        {/* ============ OVERLAY CONTAINER ============ */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100]
          ${isSignUp ? "-translate-x-full" : ""}`}
        >
          <div
            className={`bg-gradient-to-r from-[#D2691E] to-[#8B4513] text-white h-full w-[200%] relative -left-full transition-transform duration-700 ease-in-out
            ${isSignUp ? "translate-x-1/2" : ""}`}
          >
            {/* OVERLAY LEFT (Shown when Right Panel is Active) */}
            <div className="absolute top-0 w-1/2 h-full flex flex-col items-center justify-center px-10 text-center transform translate-x-0 transition-transform duration-700">
              <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
              <p className="mb-8">To keep connected with your favorite mess, please login with your personal info.</p>
              <button onClick={() => setIsSignUp(false)} className="overlay-btn">
                Sign In
              </button>
            </div>

            {/* OVERLAY RIGHT (Shown when Left Panel is Active) */}
            <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-10 text-center transform translate-x-0 transition-transform duration-700">
              <h1 className="text-3xl font-bold mb-4">Hello, Foodie!</h1>
              <p className="mb-8">Enter your personal details and start your journey with us.</p>
              <button onClick={() => setIsSignUp(true)} className="overlay-btn">
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
        .btn:hover {
          background: #8B4513;
        }
        .btn:active {
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