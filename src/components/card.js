import { popupImage, popupCaption, imagePopup, userId, confirmPopup, confirmButton, renderLoading } from './index.js';
import { openModal, popupCloseOverlay, closeModal } from './modal.js';

import { deleteCard, addLike, deleteLike } from './api.js';

export { createCard };

function createCard(item) {
    let cardTemplate = document.querySelector('#card-template').content;
    let cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

    let cardLink = cardElement.querySelector('.card__image');
    let cardName = cardElement.querySelector('.card__title');
    let cardLikeCount = cardElement.querySelector('.card__like-count');
    let cardLikeButton = cardElement.querySelector('.card__like-button');
    let cardDeleteButton = cardElement.querySelector('.card__delete-button');

    cardLink.src = item.link;
    cardName.textContent = item.name;
    cardLikeCount.textContent = item.likes ? item.likes.length : 0;

    cardLikeButton.addEventListener('click', function () {
        cardLikeButton.classList.toggle('card__like-button_is-active')
        if (cardLikeButton.classList.contains('card__like-button_is-active')) {
            addLike(item._id)
                .then(res => {
                    cardLikeCount.textContent = res.likes.length;
                })
                .catch(err => console.log(err));
        } else {
            deleteLike(item._id)
            .then(res => {
                cardLikeCount.textContent = res.likes.length;
            })
            .catch(err => console.log(err));
        }
    })

    if (item.owner && userId !== item.owner._id) {
        cardDeleteButton.classList.add('card__delete-button_invisible');
    }

    cardDeleteButton.addEventListener('click', function (evt) {
        openModal(confirmPopup);
        popupCloseOverlay(confirmPopup);
        confirmButton.addEventListener('click', function () {
            const card = evt.target.closest('.places__item');
            card.remove();
            deleteCard(item._id)
                .then(() => {
                    cardElement.remove()
                    closeModal(confirmPopup)
                })
                .catch(err => console.log(err));
    });
        })

    cardLink.addEventListener('click', function () {
        popupImage.src = item.link;
        popupCaption.textContent = item.name;
        openModal(imagePopup);
        popupCloseOverlay(imagePopup);
    })

    return cardElement;
}