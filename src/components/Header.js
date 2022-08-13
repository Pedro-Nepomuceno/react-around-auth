import logo from "../images/header.svg";
import React from "react";

function Header() {
	return (
		<header className="header">
			<img
				className="header__image"
				src={logo}
				alt="Around the United States"
			/>
		</header>
	);
}
export default Header;
