import { enableValidation } from './validate.js';
import { createCard } from './card.js';
import { openModal, closeModal, popupCloseOverlay } from './modal.js';

import { userInformation, getInitialCards, editingProfile, addCard, updateAvatarProfile } from './api.js';

export { popupImage, popupCaption, imagePopup, confirmPopup, confirmButton, userId, renderLoading };

let userId;

const placesList = document.querySelector('.places__list');

const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const confirmPopup = document.querySelector('.popup_confirm');
const newAvatarPopup = document.querySelector('.popup_type_new-avatar');

profilePopup.classList.add('popup_is-animated');
cardPopup.classList.add('popup_is-animated');
imagePopup.classList.add('popup_is-animated');
confirmPopup.classList.add('popup_is-animated');
newAvatarPopup.classList.add('popup_is-animated');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const popupCloseButtonProfileEdit = profilePopup.querySelector('.popup__close');
const popupCloseButtonCardAdd = cardPopup.querySelector('.popup__close');
const popupCloseButtonImage = imagePopup.querySelector('.popup__close');
const popupCloseButtonConfirm = confirmPopup.querySelector('.popup__close');
const popupCloseButtonNewAvatar = newAvatarPopup.querySelector('.popup__close');

const profileFormElement = profilePopup.querySelector('.popup__form')
const cardFormElemnt = cardPopup.querySelector('.popup__form')
const newAvatarFormElement = newAvatarPopup.querySelector('.popup__form')

const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const confirmButton = confirmPopup.querySelector('.popup__button');


getInitialCards()
    .then((cards) => {
        cards.forEach(item => {
            placesList.append(createCard(item));
        })   
    })
    .catch(err => console.log(err));

function renderLoading(button, isLoading) {
  if (isLoading) {
    button.textContent = 'Сохранение...'
  } else {
    button.textContent = 'Сохранить'
  }
}

profileEditButton.addEventListener('click', function () {
    nameInput.value = profileTitle.textContent
    jobInput.value = profileDescription.textContent
    openModal(profilePopup);
    popupCloseOverlay(profilePopup);
})

popupCloseButtonProfileEdit.addEventListener('click', () => closeModal(profilePopup))
popupCloseButtonCardAdd.addEventListener('click', () => closeModal(cardPopup))
popupCloseButtonImage.addEventListener('click', () => closeModal(imagePopup))
popupCloseButtonConfirm.addEventListener('click', () => closeModal(confirmPopup))
popupCloseButtonNewAvatar.addEventListener('click', () => closeModal(newAvatarPopup))

profileImage.addEventListener('click', function () {
    openModal(newAvatarPopup);
    popupCloseOverlay(newAvatarPopup);
})

function handleNewAvatarFormSubmit(evt) {
    const urlAvatar = document.querySelector('.popup__input_type_url-avatar');
    const newAvatarButtonSubmit = newAvatarPopup.querySelector('.popup__button');

    evt.preventDefault();
    renderLoading(newAvatarButtonSubmit, true);

    updateAvatarProfile(urlAvatar.value)
        .then(res => {
            profileImage.style.backgroundImage = `url('${res.avatar}')`;
            closeModal(newAvatarPopup);
        })
        .catch(err => console.log(err))
        .finally(() => renderLoading(newAvatarButtonSubmit, false));
    urlAvatar.value = '';
}

newAvatarFormElement.addEventListener('submit', handleNewAvatarFormSubmit);



// Находим поля формы в DOM
const nameInput = profilePopup.querySelector('.popup__input_type_name')
const jobInput = profilePopup.querySelector('.popup__input_type_description')

// Обработчик «отправки» формы, хотя пока
// она никуда отправляться не будет
function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    const profileButtonSubmit = profilePopup.querySelector('.popup__button');

    renderLoading(profileButtonSubmit, true);
    editingProfile(nameInput.value, jobInput.value)
        .then(res => {
            profileTitle.textContent = res.name;
            profileDescription.textContent = res.about;
            closeModal(profilePopup);
        })
        .catch(err => console.log(err))
        .finally(() => renderLoading(profileButtonSubmit, false));
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
profileFormElement.addEventListener('submit', handleProfileFormSubmit);


profileAddButton.addEventListener('click', function () {
    openModal(cardPopup);
    popupCloseOverlay(cardPopup);
})


function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const cardButtonSubmit = cardPopup.querySelector('.popup__button');
    const name = document.querySelector('.popup__input_type_card-name');
    const url = document.querySelector('.popup__input_type_url');
    renderLoading(cardButtonSubmit, true);
    
    addCard(name.value, url.value)
        .then(res => {
            const newCard = createCard({
                name: res.name,
                link: res.link,
                likes: res.likes,
                _id: res._id,
                owner: res.owner
            });
            placesList.prepend(newCard);
            closeModal(cardPopup);
        })
        .catch(err => console.log(err))
        .finally(() => renderLoading(cardButtonSubmit, false));

    name.value = '';
    url.value = '';
}

cardFormElemnt.addEventListener('submit', handleCardFormSubmit);


// Создание объекта с настройками валидации

const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
}
  
  // включение валидации вызовом enableValidation
  // все настройки передаются при вызове
  
enableValidation(validationSettings);

userInformation()
    .then((res) => {
        userId = res._id;
        profileTitle.textContent = res.name;
        profileDescription.textContent = res.about;
        profileImage.style.backgroundImage = `url('${res.avatar}')`;
    })
    .catch(err => console.log(err));