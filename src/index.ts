import './scss/styles.scss';

import {EventEmitter} from "./components/base/events";
import {ensureElement, cloneTemplate, createElement} from "./utils/utils";
import {CatalogChangeEvent, AppState, ProductItem} from "./components/AppData";
import {Page} from "./components/Page";
import {Card} from "./components/Card";
import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {Order} from "./components/Order";
import { ContactsForm } from './components/ContactsForm';
import {TOrder} from "./types";
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);
 

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);


// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category
        });
    });
});

// Открыть карточку
events.on('card:select', (item: ProductItem) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: ProductItem) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
			if (appData.isInBasket(item)) {
				appData.removeFromBasket(item);
				card.button = 'В корзину';
			} else {
				appData.addToBasket(item);
				card.button = 'Удалить из корзины';
			}
		},
    });

    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category,
            description: item.description
        })
    });
});

events.on('basket:change', () => {
	page.counter = appData.basket.items.length;
    console.log(appData.basket.items)
    console.log(appData.catalog)
	basket.items = appData.basket.items.map((id) => {
        const item = appData.catalog.find((item) => item.id === id);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => appData.removeFromBasket(item)
        });
		return card.render(item);
	});

	basket.total = appData.basket.total;
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

events.on('bids:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, basket.render())
    });
});

// Открыть форму оплата + адрес
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^order\..*:change$/,
	(data: { field: keyof TOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
		appData.validateOrderForm();
	}
);

events.on('orderFormErrors:change', (error: Partial<TOrder>) => {
	const { payment, address } = error;
	const formIsValid = !payment && !address;
	order.valid = formIsValid;
	if (!formIsValid) {
		order.errors = address;
	} else {
		order.errors = '';
	}
});

// Открыть форму контакты
events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^contacts\..*:change$/,
	(data: { field: keyof TOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
		appData.validateContactsForm();
	}
);

events.on('contactsFormErrors:change', (error: Partial<TOrder>) => {
	const { email, phone } = error;
	const formIsValid = !email && !phone;
	contactsForm.valid = formIsValid;
	if (!formIsValid) {
		contactsForm.errors = email || phone;
	} else {
		contactsForm.errors = '';
	}
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
	api
		.createOrder({ ...appData.order, ...appData.basket })
		.then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    appData.clearBasket();
                    events.emit('auction:changed');
                }
            });

			modal.render({
				content: success.render(),
			});
            success.total = result.total;
			appData.clearBasket();
			appData.clearOrder();
		})
		.catch(console.error)
});

// Получаем карточки с сервера
api.getProductList()
    .then(appData.setItems.bind(appData))
    .catch(err => {
        console.error(err);
    });