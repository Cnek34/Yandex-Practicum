export { enableValidation };

const showInputError = (formElement, element, errorMessage) => {
    
    const formError = formElement.querySelector(`.${element.id}-error`);

    element.classList.add('form__input_type_error');
    formError.textContent = errorMessage;
    formError.classList.add('form__input-error_active');
};

// Функция, которая удаляет класс с ошибкой
const hideInputError = (formElement, element) => {

    const formError = formElement.querySelector(`.${element.id}-error`);

    element.classList.remove('form__input_type_error');
    formError.classList.remove('form__input-error_active');
    formError.textContent = '';
};

// Функция, которая проверяет валидность поля
const isValid = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    // Если поле не проходит валидацию, покажем ошибку
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    // Если проходит, скроем
    hideInputError(formElement, inputElement);
  }
};

const setEventListeners = (formElement) => {

  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');

  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {

    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement)
      toggleButtonState(inputList, buttonElement);
    });
  });
};


const enableValidation = () => {
    const formList = Array.from(document.querySelectorAll('.popup__form'));
  
    formList.forEach((formElement) => {
      setEventListeners(formElement);
    });
};

const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    })
}; 

const toggleButtonState = (inputList, buttonElement) => {
    // Если есть хотя бы один невалидный инпут
    if (hasInvalidInput(inputList)) {
      // сделай кнопку неактивной
      buttonElement.classList.add('popup__button_inactive');
      buttonElement.setAttribute('disabled', '');
    } else {
      // иначе сделай кнопку активной
      buttonElement.classList.remove('popup__button_inactive');
      buttonElement.removeAttribute('disabled', '');
    }
}; 