"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  //   const handleShowPassword = (type: "password" | "confirm") => {
  //     if (type === "password") setShowPassword((prev) => !prev);
  //     else setShowConfirmPassword((prev) => !prev);
  //   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, email, password, confirm } = formData;
    if (!username || !email || !password || !confirm) {
      setErrorMsg("Incomplete information filled out");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords don't match");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/authentication/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        console.log("Register success!");
        router.push("/login");
      } else {
        setErrorMsg("Register failed");
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMsg("Something went wrong!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-logo">
        <img src="#" alt="logo" />
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-data">
          <div className="username">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </div>

          <div className="email">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          <div className="password">
            <label>Password:</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              <button
                type="button"
                className="show-btn"
                onFocus={() => setShowPassword(true)} 
                onBlur={() => setShowPassword(false)} 
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="confirm-password">
            <label>Confirm:</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm"
                value={formData.confirm}
                onChange={handleChange}
                placeholder="Enter confirm password"
              />
              <button
                type="button"
                className="show-btn"
                onFocus={() => setShowConfirmPassword(true)} 
                onBlur={() => setShowConfirmPassword(false)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {errorMsg && <p className="msg-error">{errorMsg}</p>}

          <div className="btn">
            <button type="submit">Register</button>
          </div>
        </div>
      </form>

      <div className="alt-register">
        <div className="alt-line">
          <div className="line"></div>
          <p className="p-or">OR</p>
          <div className="line"></div>
        </div>
        <p>
          ALREADY HAVE AN ACCOUNT? <a href="/login">LOGIN HERE</a>
        </p>
      </div>
    </div>
  );
}
