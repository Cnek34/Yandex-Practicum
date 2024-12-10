import { initialCards } from './cards.js';
import { enableValidation } from './validate.js';
import { createCard } from './card.js';
import { openModal, closeModal, popupCloseOverlay } from './modal.js';

export { popupImage, popupCaption, imagePopup };


const placesList = document.querySelector('.places__list')

const profilePopup = document.querySelector('.popup_type_edit')
const cardPopup = document.querySelector('.popup_type_new-card')
const imagePopup = document.querySelector('.popup_type_image')

profilePopup.classList.add('popup_is-animated');
cardPopup.classList.add('popup_is-animated');
imagePopup.classList.add('popup_is-animated');

const profileEditButton = document.querySelector('.profile__edit-button')
const profileAddButton = document.querySelector('.profile__add-button')
const popupCloseButtonProfileEdit = document.querySelector('.popup_type_edit .popup__close')
const popupCloseButtonCardAdd = document.querySelector('.popup_type_new-card .popup__close')
const popupCloseButtonImage = document.querySelector('.popup_type_image .popup__close')

const popupImage = document.querySelector('.popup__image')
const popupCaption = document.querySelector('.popup__caption')



initialCards.forEach(item => {
    placesList.append(createCard(item));
})

profileEditButton.addEventListener('click', function () {
    const nameOutput = document.querySelector('.profile__title');
    const jobOutput = document.querySelector('.profile__description');
    nameInput.value = nameOutput.textContent
    jobInput.value = jobOutput.textContent
    openModal(profilePopup);
    popupCloseOverlay(profilePopup);
})

popupCloseButtonProfileEdit.addEventListener('click', () => closeModal(profilePopup))
popupCloseButtonCardAdd.addEventListener('click', () => closeModal(cardPopup))
popupCloseButtonImage.addEventListener('click', () => closeModal(imagePopup))


// Находим форму в DOM
const profileFormElement = document.querySelector('.popup_type_edit').querySelectorAll('.popup__form')[0]
// Находим поля формы в DOM
const nameInput = profilePopup.querySelector('.popup__input_type_name')
const jobInput = profilePopup.querySelector('.popup__input_type_description')

// Обработчик «отправки» формы, хотя пока
// она никуда отправляться не будет
function handleProfileFormSubmit(evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
                                                // Так мы можем определить свою логику отправки.
                                                // О том, как это делать, расскажем позже.

    // Получите значение полей jobInput и nameInput из свойства value
    const name = nameInput.value;
    const job = jobInput.value;

    // Выберите элементы, куда должны быть вставлены значения полей
    const nameOutput = document.querySelector('.profile__title');
    const jobOutput = document.querySelector('.profile__description');

    nameOutput.textContent = name
    jobOutput.textContent = job
    closeModal(profilePopup);
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
profileFormElement.addEventListener('submit', handleProfileFormSubmit);


profileAddButton.addEventListener('click', function () {
    openModal(cardPopup);
    popupCloseOverlay(cardPopup);
})

const cardFormElemnt = document.querySelector('.popup_type_new-card').querySelectorAll('.popup__form')[0]

function handleCardFormSubmit(evt) {
    evt.preventDefault();

    const name = document.querySelector('.popup__input_type_card-name');
    const url = document.querySelector('.popup__input_type_url');

    const newCard = {
        name: name.value,
        link: url.value
    }

    initialCards.unshift(newCard);

    console.log(placesList)

    placesList.innerHTML = '';
    initialCards.forEach(item => {
        placesList.append(createCard(item));
    })

    closeModal(cardPopup);

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