import { initialCards } from './cards.js';
import { popupImage, popupCaption, imagePopup } from './index.js';
import { openModal, popupCloseOverlay } from './modal.js';

export { createCard };

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
        openModal(imagePopup);
        popupCloseOverlay(imagePopup);
    })

    return cardElement;
}