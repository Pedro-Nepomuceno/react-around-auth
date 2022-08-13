class Auth {
	constructor({ baseUrl, headers }) {
		this.baseUrl = baseUrl;
		this.headers = headers;
	}

	_handleServerResponse(res) {
		return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
	}

	register({ email, password }) {
		return fetch(`${this.baseUrl}/signup`, {
			method: "POST",
			headers: this.headers,
			body: JSON.stringify({
				email,
				password,
			}),
		}).then(this._handleServerResponse);
	}
}
const auth = new Auth({
	baseUrl: "https://register.nomoreparties.co",
	headers: {
		"Content-Type": "application/json",
	},
});
export default auth;
