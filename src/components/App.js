import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import React from "react";
import { Route } from "react-router-dom";
import api from "../utils/api";
import auth from "../utils/auth.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { EditProfilePopup } from "../components/EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";

function App() {
	const [cards, setCards] = React.useState([]);
	const [isEditAvatarPopupOpen, setIsAvatarPopupOpen] = React.useState(false);
	const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
	const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(
		false
	);
	const [selectedCard, setSelectedCard] = React.useState(null);
	const [currentUser, setCurrentUser] = React.useState([]);

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

	return (
		<div className="page">
			<CurrentUserContext.Provider value={currentUser}>
				<Header />
				<Main
					onEditAvatarClick={handleEditAvatarClick}
					onEditProfileClick={handleEditProfileClick}
					onAddPlaceClick={handleAddPlaceClick}
					onCardClick={handleCardClick}
					handleCardDelete={handleCardDelete}
					handleCardLike={handleCardLike}
					cards={cards}
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
