import { useState, useEffect } from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import api from "../utils/api";
import auth from "../utils/auth.js";
import { Register } from "./Register.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { EditProfilePopup } from "../components/EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import { Login } from "./Login";
import { InfoTooltip } from "./InfoTooltip";

function App() {
	const [cards, setCards] = React.useState([]);
	const [isEditAvatarPopupOpen, setIsAvatarPopupOpen] = React.useState(false);
	const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
	const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(
		false
	);
	const [selectedCard, setSelectedCard] = React.useState(null);
	const [currentUser, setCurrentUser] = React.useState([]);
	const [infoToolTip, setInfoToolTip] = useState(false);
	const [loggedIn, setIsLogged] = useState(false);
	const [status, setStatus] = useState(false);
	const [email, setEmail] = React.useState("");

	const history = useHistory();

	React.useEffect(() => {
		api
			.getUserInfo()
			.then((data) => {
				setCurrentUser(data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	function handleCardClick(card) {
		setSelectedCard(card);
	}

	function handleEditAvatarClick() {
		setIsAvatarPopupOpen(true);
	}
	function handleEditProfileClick() {
		setEditProfilePopupOpen(true);
	}
	function handleAddPlaceClick() {
		setIsAddPlacePopupOpen(true);
	}
	function handleClosePopup() {
		setSelectedCard(false);
		setIsAvatarPopupOpen(false);
		setEditProfilePopupOpen(false);
		setIsAddPlacePopupOpen(false);
		setInfoToolTip(false);
	}
	function handleUpdateUser(user) {
		api
			.setUserProfile(user)
			.then((data) => {
				setCurrentUser(data);
				setEditProfilePopupOpen(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	function handleUpdateAvatar(userPicture) {
		api
			.editProfilePic(userPicture)
			.then((data) => {
				setCurrentUser(data);
				setIsAvatarPopupOpen(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function handleCardDelete(card) {
		api
			.deleteCard(card._id)
			.then(() => {
				setCards((state) =>
					state.filter((currentCard) => currentCard._id !== card._id)
				);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function handleCardLike(card) {
		const isLiked = card.likes.some((user) => user._id === currentUser._id);

		api
			.handleLikePhoto(card._id, isLiked)
			.then((newCard) => {
				setCards((state) =>
					state.map((currentCard) =>
						currentCard._id === card._id ? newCard : currentCard
					)
				);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	React.useEffect(() => {
		api
			.getInitialCards()
			.then((cardData) => {
				setCards(cardData);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	function handleAddPlaceSubmit(newCard) {
		api
			.addNewCard(newCard)
			.then((data) => {
				setCards([data, ...cards]);
				setIsAddPlacePopupOpen(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	function onRegister(email, password) {
		auth
			.register(email, password)
			.then((res) => {
				if (res.data._id) {
					history.push("/signin");
					setInfoToolTip(true);
					setStatus(true);
					setTimeout(() => {
						handleClosePopup();
					}, 3000);
				} else {
					setInfoToolTip(true);
					setStatus(false);
				}
			})
			.catch(() => {
				setInfoToolTip(true);
				setStatus(false);
			});
	}

	function onLogin({ email, password }) {
		auth
			.login({ email, password })
			.then((res) => {
				if (res.token) {
					setEmail(email);
					setIsLogged(true);
					localStorage.setItem("jwt", res.token);
					history.push("/");
				} else {
					setInfoToolTip(true);
					setStatus(false);
				}
			})
			.catch(() => {
				setInfoToolTip(true);
				setStatus(false);
			});
	}
	React.useEffect(() => {
		const token = localStorage.getItem("jwt");
		console.log(token);
		if (token) {
			auth
				.checkToken(token)
				.then((res) => {
					if (res) {
						setEmail(res.data.email);
						setIsLogged(true);
						history.push("/");
					} else {
						return;
					}
				})
				.catch((err) => console.log(err));
		}
	}, []);

	function onSignOut() {
		localStorage.removeItem("jwt");
		setInfoToolTip(false);
		history.push("/signin");
	}

	return (
		<div className="page">
			<CurrentUserContext.Provider value={currentUser}>
				<Header onSignOut={onSignOut} email={email} />
				<Switch>
					<ProtectedRoute exact path="/" loggedIn={setIsLogged}>
						<Main
							onEditAvatarClick={handleEditAvatarClick}
							onEditProfileClick={handleEditProfileClick}
							onAddPlaceClick={handleAddPlaceClick}
							onCardClick={handleCardClick}
							handleCardDelete={handleCardDelete}
							handleCardLike={handleCardLike}
							cards={cards}
						/>
					</ProtectedRoute>
					<Route path="/signup">
						<Register onRegister={onRegister} />
					</Route>
					<Route path="/signin">
						<Login onSign={onLogin} />
					</Route>
				</Switch>
				<InfoTooltip
					isOpen={infoToolTip}
					status={status}
					onClose={handleClosePopup}
				/>
				<Footer />
				<EditProfilePopup
					isOpen={isEditProfilePopupOpen}
					onClose={handleClosePopup}
					onUpdateUser={handleUpdateUser}
				/>
				<EditAvatarPopup
					isOpen={isEditAvatarPopupOpen}
					onClose={handleClosePopup}
					onUpdateAvatar={handleUpdateAvatar}
				/>
				<AddPlacePopup
					isOpen={isAddPlacePopupOpen}
					onClose={handleClosePopup}
					onAddPlaceSubmit={handleAddPlaceSubmit}
				/>

				<ImagePopup card={selectedCard} onClose={handleClosePopup} />
			</CurrentUserContext.Provider>
			<div className="popup" id="delete-popup">
				<div className="popup__content popup__content_type_delete">
					<button className="popup__close" type="button"></button>
					<h3 className="popup__title">Are you sure?</h3>

					<button
						type="submit"
						className="popup__submit popup__submit_type_delete">
						Yes
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
