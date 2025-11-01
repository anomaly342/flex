"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface RegisterData {
	username: string;
	password: string;
	confirm: string;
}

export default function RegisterPage() {
	const router = useRouter();

	const [formData, setFormData] = useState<RegisterData>({
		username: "",
		password: "",
		confirm: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const [validity, setValidity] = useState({
		username: false,
		password: false,
		confirm: false,
	});

	const regex = /^[0-9a-zA-Z\-_]{4,14}$/;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		const updatedForm = { ...formData, [name]: value };
		setFormData(updatedForm);

		const newValidity = { ...validity };

		if (name === "username") {
			newValidity.username = regex.test(value);
		} else if (name === "password") {
			newValidity.password = regex.test(value);
			newValidity.confirm = updatedForm.confirm === value;
		} else if (name === "confirm") {
			newValidity.confirm = value === updatedForm.password;
		}

		setValidity(newValidity);
		setErrorMsg("");
	};

	const handleShowPassword = (type: "password" | "confirm") => {
		if (type === "password") setShowPassword((prev) => !prev);
		else setShowConfirmPassword((prev) => !prev);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const { username, password, confirm } = formData;
		if (!username || !password || !confirm) {
			setErrorMsg("Incomplete information filled out");
			return;
		}
		if (password !== confirm) {
			setErrorMsg("Passwords don't match");
			return;
		}

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/register`,
				{
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						username: username,
						password: password,
					}),
				}
			);

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
				<img src="/logo.png" alt="logo" />
			</div>

			<form className="register-form" onSubmit={handleSubmit}>
				<div className="form-data">
					<div className="username">
						<label>Username:</label>
						<div
							className={`input-wrapper ${
								validity.username ? "valid" : "invalid"
							}`}
						>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
								className={validity.username ? "valid" : "invalid"}
								placeholder="Enter username"
							/>
						</div>
					</div>

					<div className="password">
						<label>Password:</label>
						<div
							className={`input-wrapper ${
								validity.password ? "valid" : "invalid"
							}`}
						>
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
								onFocus={() => handleShowPassword("password")}
								onBlur={() => setShowPassword(false)}
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
					</div>

					<div className="confirm-password">
						<label>Confirm:</label>
						<div
							className={`input-wrapper ${
								validity.confirm ? "valid" : "invalid"
							}`}
						>
							<input
								type={showConfirmPassword ? "text" : "password"}
								name="confirm"
								value={formData.confirm}
								onChange={handleChange}
								className={validity.confirm ? "valid" : "invalid"}
								placeholder="Enter confirm password"
							/>
							<button
								type="button"
								className="show-btn"
								onFocus={() => handleShowPassword("confirm")}
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

			<div className="alt-login">
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
