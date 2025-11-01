"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
interface RegisterData {
	username: string;
	password: string;
}

export default function LoginPage() {
	const router = useRouter();

	const [formData, setFormData] = useState<RegisterData>({
		username: "",
		password: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const [validity, setValidity] = useState({
		username: false,
		password: false,
	});

	const regex = /^[0-9a-zA-Z\-_]{4,14}$/;

	const handleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		setValidity({
			...validity,
			[name]: regex.test(value),
		});
		setErrorMsg("");
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		const { username, password } = formData;
		if (!username || !password) {
			setErrorMsg("Incomplete information filled out");
			return;
		}

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					credentials: "include",
					body: new URLSearchParams({
						username: username,
						password: password,
					}),
				}
			);

			if (res.ok) {
				console.log("Login success!");
				router.push("/home");
			} else {
				setErrorMsg("Login failed");
			}
		} catch (err) {
			console.error("Error:", err);
			setErrorMsg("Something went wrong!");
		}
	};

	return (
		<div className="login-container">
			<div className="login-logo">
				<img src="/logo.png" alt="logo" />
			</div>

			<form className="login-form" onSubmit={handleLogin}>
				<div className="form-data">
					<div className="username">
						<label>Username:</label>
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							className={validity.username ? "valid" : "invalid"}
							placeholder="Enter username"
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
								className={validity.password ? "valid" : "invalid"}
								placeholder="Enter password"
							/>
							<button
								type="button"
								className="show-btn"
								onClick={handleShowPassword}
								onBlur={() => setShowPassword(false)}
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
					</div>

					{errorMsg && <p className="msg-error">{errorMsg}</p>}

					<div className="btn">
						<button type="submit">Login</button>
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
					Don't have an account? <a href="/register">Register Now</a>
				</p>
			</div>
		</div>
	);
}
