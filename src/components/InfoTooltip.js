import React from "react";
import successIcon from "../images/successIcon.svg";
import failIcon from "../images/failIcon.svg";

export function InfoTooltip(isOpen, status, onClose) {
	return (
		<div className={`popup  ${isOpen && "popup_open"}`}>
			<div className="popup__content">
				{status === "success" ? (
					<div>
						{" "}
						<img src={successIcon} />
						<p>Success!You have now been registered.</p>
					</div>
				) : (
					<div>
						{" "}
						<img src={failIcon} />
						<p>Oops! Something went wrong, please try again.</p>
					</div>
				)}
				<button
					className="popup__close"
					onClick={onClose}
					type="button"></button>
			</div>
		</div>
	);
}
