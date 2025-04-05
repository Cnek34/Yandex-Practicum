interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

interface IOrder {
	payment: 'cash' | 'card';
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;
}

interface IOrderResult {
	id: string;
	total: number;
}

interface IBasketModel {
	items: string[];
	total: number;
}