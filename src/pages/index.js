import Api from "../components/Api.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";
import "./index.css";
import {
  profileEditOpenButton,
  addCardOpenButton,
  editAvatarOpenButton,
  profileTitleInput,
  profileDescriptionInput,
  config,
} from "../utils/constants.js";

// CREATE AND RENDER CARD FUNCTIONS
function createCard(cardData) {
  const cardElement = new Card(
    cardData,
    "#card-template",
    handleLikeClick,
    handleDeleteClick,
    (link, name) => {
      imagePreview.open(link, name);
    }
  );
  return cardElement.getView();
}

function renderCard(cardData) {
  const element = createCard(cardData);
  cardSection.addItem(element);
}

// INITIAL CARDS AND USER INFO //
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "67f9ee29-81ba-42c1-865a-539d34535736",
    "Content-Type": "application/json",
  },
});

api
  .loadPageContent()
  .then(([cards, userData]) => {
    newUserInfo.setUserAvatar(userData.avatar);
    newUserInfo.setUserInfo({
      name: userData["name"],
      about: userData["about"],
      id: userData["id"],
    });
    cardSection = new Section(
      {
        items: cards,
        renderer: renderCard,
      },
      ".cards__list"
    );
    cardSection.renderItems();
  })
  .catch((err) => {
    console.error(err);
  });

let cardSection;

const newUserInfo = new UserInfo(
  ".profile__title",
  ".profile__description",
  ".profile__image"
);

// ADD CARD //
const addCardPopup = new PopupWithForm("#add-card-modal", handleAddCardSubmit);
addCardPopup.setEventListeners();

function handleAddCardSubmit(data) {
  addCardPopup.setLoading(true);
  api
    .addCard(data)
    .then((res) => {
      renderCard(res);
      addCardPopup.close();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => addCardPopup.setLoading(false, "Create"));
}

addCardOpenButton.addEventListener("click", () => {
  formValidators["edit-profile-form"].resetValidation();
  addCardPopup.open();
});

// EDIT PROFILE //
const editProfilePopup = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileEditSubmit
);
editProfilePopup.setEventListeners();

function handleProfileEditSubmit(data) {
  editProfilePopup.setLoading(true);
  api
    .updateUserInfo(data.name, data.about)
    .then((res) => {
      newUserInfo.setUserInfo(res);
      editProfilePopup.close();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => editProfilePopup.setLoading(false, "Save"));
}

profileEditOpenButton.addEventListener("click", () => {
  const data = newUserInfo.getUserInfo();
  profileTitleInput.value = data.name;
  profileDescriptionInput.value = data.about;
  editProfilePopup.open();
});

// CHANGE AVATAR //
const updateAvatarForm = new PopupWithForm(
  "#avatar-image-modal",
  handleAvatarFormSubmit
);
updateAvatarForm.setEventListeners();

function handleAvatarFormSubmit(data) {
  updateAvatarForm.setLoading(true);
  api
    .updateAvatar(data.avatar)
    .then((res) => {
      newUserInfo.setUserAvatar(res.avatar);
      updateAvatarForm.close();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      updateAvatarForm.setLoading(false, "Save");
    });
}

editAvatarOpenButton.addEventListener("click", () => {
  formValidators["edit-avatar-form"].resetValidation();
  updateAvatarForm.open();
});

// IMAGE PREVIEW //
const imagePreview = new PopupWithImage("#image-modal");
imagePreview.setEventListeners();

// LIKE CARD //
function handleLikeClick(item) {
  if (!item.isLiked) {
    api
      .likeCard(item.getId())
      .then((res) => {
        item.updateLikeStatus(res.isLiked);
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    api
      .unlikeCard(item.getId())
      .then((res) => {
        item.updateLikeStatus(res.isLiked);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

// DELETE CARD //
const confirmDelete = new PopupWithConfirmation("#delete-card-modal");
confirmDelete.setEventListeners();

function handleDeleteClick(card) {
  confirmDelete.open();
  confirmDelete.setSubmitAction(() => {
    confirmDelete.setLoading(true);
    api
      .deleteCard(card.id)
      .then(() => {
        confirmDelete.close();
        card.removeCard();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        confirmDelete.setLoading(false, "Yes");
      });
  });
}

// FORM VALIDATION //
const formValidators = {};
const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    const validator = new FormValidator(config, formElement);
    const formName = formElement.getAttribute("name");
    formValidators[formName] = validator;
    validator.enableValidation();
  });
};
enableValidation(config);
