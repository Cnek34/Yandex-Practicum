export interface IProduct {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export type PaymentMethod = 'cash' | 'card';

export interface IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IBasketModel {
	items: string[];
	total: number;
}

export interface IAppState {
    catalog: IProduct[];
    basket: IBasketModel[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export type TOrder = Omit<IOrder, 'items' | 'total'>
export type TOrderForm = Pick<IOrder, 'payment' | 'address'>;
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;