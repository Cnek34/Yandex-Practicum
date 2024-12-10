export { openModal, closeModal, popupCloseOverlay };

function openModal(popup) {      
    popup.classList.add('popup_is-opened');
}

function closeModal(popup) {      
    popup.classList.remove('popup_is-opened');
}

// Закрытие поп-апа кликом на оверлей
const popupCloseOverlay = (formElement) => {
    formElement.addEventListener("click", (evt) => {
      if (evt.currentTarget === evt.target) {
        closeModal(formElement);
      }
    });
  }
  
  // Закрытие по-папа нажатием на Esc
  function closeByEsc(evt) {

    if (evt.key === "Escape") {       
      const openedPopup = document.querySelector('.popup_is-opened');       
      closeModal(openedPopup);      
    } 
  }
  
  document.addEventListener('keydown', closeByEsc);