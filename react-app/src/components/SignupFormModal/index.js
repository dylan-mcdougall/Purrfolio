import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp, demoUser } from "../../store/session";
import "./SignupForm.css";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			const data = await dispatch(signUp(firstName, lastName, username, email, password));
			if (data) {
				for (let i = 0; i < data.length; i++) {
					if (data[i].includes('first_name')) {
						data[i] = 'first_name : First name is required.'
					}
					if (data[i].includes('last_name')) {
						data[i] = 'last_name : Last name is required.'
					}
				}
				setErrors(data);
			} else {
				closeModal();
			}
		} else {
			setErrors([
				"Confirm Password field must be the same as the Password field",
			]);
		}
	};

	const handleClick = async (e) => {
		e.preventDefault();
		dispatch(demoUser());
		closeModal();
	}

	return (
		<div className="signup-form-wrapper">
			<div className="signup-form-nav">
				<div className="signup-form-signup-title">
					<h2>Sign Up</h2>
				</div>
				<div className="signup-form-login-title">
					<OpenModalButton
						buttonText={"Log In"}
						modalComponent={<LoginFormModal />}
					/>
				</div>
			</div>
			<form onSubmit={handleSubmit}>
				{errors.map((error, idx) => (
					<li className="errors" key={idx}>{error.split(' : ')[1]}</li>
				))}
				<label>
					First Name
					<input
						type="text"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
				</label>
				<label>
					Last Name
					<input
					type="text"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					required
					/>
				</label>
				<label>
					Email
					<input
						type="text"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				<label>
					Username
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</label>
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<label>
					Confirm Password
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				<div className="button-interface">
					<a className="demo-user" onClick={handleClick}>Demo User</a>
					<button className="submit" type="submit">Sign Up</button>
				</div>
			</form>
		</div>
	);
}

export default SignupFormModal;
