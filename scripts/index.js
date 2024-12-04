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

function createCard(item) {
    let cardTemplate = document.querySelector('#card-template').content;
    let cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

    let cardLink = cardElement.querySelector('.card__image');
    let cardName = cardElement.querySelector('.card__title');
    let cardLikeButton = cardElement.querySelector('.card__like-button');
    let cardDeleteButton = cardElement.querySelector('.card__delete-button');

    cardLink.src = item.link;
    cardName.textContent = item.name;

    cardLikeButton.addEventListener('click', function () {
        cardLikeButton.classList.toggle('card__like-button_is-active')
    })

    cardElement.dataset.link = item.link;

    cardDeleteButton.addEventListener('click', function (evt) {
        const card = evt.target.closest('.places__item');
        card.remove();

        const index = initialCards.findIndex((cardItem) => cardItem.link === card.dataset.link);
        if (index !== -1) {
            initialCards.splice(index, 1);
        }
    });

    cardLink.addEventListener('click', function () {
        popupImage.src = item.link;
        popupCaption.textContent = item.name;
        openModal(imagePopup)
    })

    return cardElement;
}

initialCards.forEach(item => {
    placesList.append(createCard(item));
})


function openModal(popup) {      
    popup.classList.add('popup_is-opened');
}

profileEditButton.addEventListener('click', function () {
    const nameOutput = document.querySelector('.profile__title');
    const jobOutput = document.querySelector('.profile__description');
    nameInput.value = nameOutput.textContent
    jobInput.value = jobOutput.textContent
    openModal(profilePopup);
})

function closeModal(popup) {      
    popup.classList.remove('popup_is-opened');
}

popupCloseButtonProfileEdit.addEventListener('click', () => closeModal(profilePopup))
popupCloseButtonCardAdd.addEventListener('click', () => closeModal(cardPopup))
popupCloseButtonImage.addEventListener('click', () => closeModal(imagePopup))


// Находим форму в DOM
const profileFormElement = document.querySelector('.popup_type_edit').querySelectorAll('.popup__form')[0]
// Находим поля формы в DOM
const nameInput = document.querySelector('.popup__input_type_name')
const jobInput = document.querySelector('.popup__input_type_description')

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