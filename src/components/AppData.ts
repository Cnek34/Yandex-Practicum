import {Model} from "./base/Model";
import {IProduct, IAppState, IBasketModel, TOrder, PaymentMethod} from "../types";

export type CatalogChangeEvent = {
    catalog: ProductItem[]
};

export class ProductItem extends Model<IProduct> {
    id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export class AppState extends Model<IAppState> {
    items: IProduct[] = [];
    basket: IBasketModel = {
		items: [],
		total: 0,
	};
    catalog: ProductItem[];
    loading: boolean;
    preview: string | null;

    order: TOrder = {
		email: '',
		phone: '',
		address: '',
		payment: 'card',
	};
	formErrors: Partial<Record<keyof TOrder, string>> = {};

    setItems(items: IProduct[]) {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: ProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    addToBasket(item: IProduct) {
		this.basket.items.push(item.id);
		this.basket.total += item.price;
		this.events.emit('basket:change', this.basket);
	}

    removeFromBasket(item: IProduct) {
		this.basket.items = this.basket.items.filter((id) => id !== item.id);
		this.basket.total -= item.price;
		this.events.emit('basket:change', this.basket);
	}

    isInBasket(item: IProduct) {
		return this.basket.items.includes(item.id);
	}

    validateOrderForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

    setPayment(method: PaymentMethod) {
		this.order.payment = method;
	}

    setOrderField(field: keyof TOrder, value: string) {
		if (field === 'payment') {
			this.setPayment(value as PaymentMethod);
		} else {
			this.order[field] = value;
		}
	}

    validateContactsForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

    clearOrder() {
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: 'card',
		};
	}

    clearBasket() {
		this.basket.items = [];
		this.basket.total = 0;
		this.events.emit('basket:change');
	}
}