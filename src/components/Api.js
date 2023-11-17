export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  getUserInfo() {
    return fetch(this._baseUrl + "/users/me", {
      method: "GET",
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  updateUserInfo(name, about) {
    return fetch(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => this._checkResponse(res));
  }

  updateAvatar(imageURL) {
    return fetch(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: imageURL,
      }),
    }).then((res) => this._checkResponse(res));
  }

  getInitialCards() {
    return fetch(this._baseUrl + "/cards", {
      method: "GET",
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  addCard(card) {
    return fetch(this._baseUrl + "/cards", {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: card.name,
        link: card.link,
      }),
    }).then((res) => this._checkResponse(res));
  }

  // deleteCard(cardID) {
  //   return fetch(this._baseUrl + "/cards/" + cardID, {
  //     method: "DELETE",
  //     headers: {
  //       authorization: "67f9ee29-81ba-42c1-865a-539d34535736",
  //     },
  //   }).then((res) => this._checkResponse(res));
  // }

  likeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        authorization: "67f9ee29-81ba-42c1-865a-539d34535736",
      },
    }).then((res) => this._checkResponse(res));
  }

  unlikeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        authorization: "67f9ee29-81ba-42c1-865a-539d34535736",
      },
    }).then((res) => this._checkResponse(res));
  }

  // loadPageContent() {
  //   return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  // }
}