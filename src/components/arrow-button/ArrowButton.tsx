import { useState } from 'react';
import clsx from 'clsx';
import arrow from 'src/images/arrow.svg';

import styles from './ArrowButton.module.scss';

/** Функция для обработки открытия/закрытия формы */
export type ArrowButtonProps = {
	onClick: () => void;
	isOpen: boolean;
};

export const ArrowButton = ({ onClick, isOpen }: ArrowButtonProps) => {

	const arrowButtonMoving = clsx(styles.container, {
		[styles.container_open]: isOpen,
	});

	const arrowButtonRotation = clsx(styles.arrow, {
		[styles.arrow_open]: isOpen,
	});

	return (
		/* Не забываем указаывать role и aria-label атрибуты для интерактивных элементов */
		<div
			role='button'
			aria-label='Открыть/Закрыть форму параметров статьи'
			tabIndex={0}
			className={arrowButtonMoving}
			onClick={onClick}
		>	
			<img
				src={arrow}
				alt='иконка стрелочки'
				className={arrowButtonRotation}
			/>
		</div>
	);
};
