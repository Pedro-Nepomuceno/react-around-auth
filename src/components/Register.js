import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export function Register({ onRegister }) {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	function handleEmailChange(e) {
		setEmail(e.target.value);
	}
	function handlePasswordChange(e) {
		setPassword(e.target.value);
	}
	function handleSubmit(e) {
		e.preventDefault();
		const userRegistration = { email, password };
		onRegister(userRegistration);
	}

	return (
		<main className="form">
			<div className="form__register">
				<form className="form__auth">
					<h3 className="form__title">Sign-up</h3>
					<input
						className="form__input"
						type="text"
						placeholder="Email"
						required
						onChange={handleEmailChange}
					/>
					<input
						className="form__input"
						type="text"
						placeholder="Password"
						required
						onChange={handlePasswordChange}
					/>
					<button className="form__register-submit" onSubmit={handleSubmit}>
						Sign-up
					</button>
					<NavLink to="/singin" className="form__redirect">
						Already a member? Log in here!
					</NavLink>
				</form>
			</div>
		</main>
	);
}
