import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';
import { Text } from 'components/text';
import { Select } from 'components/select';
import { RadioGroup } from 'components/radio-group';
import { Separator } from 'components/separator';
import { Spacing } from 'components/spacing';
import { fontFamilyOptions, fontSizeOptions, fontColors, 
	backgroundColors, contentWidthArr, ArticleStateType, 
	defaultArticleState } from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

import { useState, useRef, useEffect } from "react";
import clsx from 'clsx';

type ArticleParamsFormProps = {
	articleState: ArticleStateType;
	setArticleState: (props: ArticleStateType) => void;
}

export const ArticleParamsForm = ({articleState, setArticleState}: ArticleParamsFormProps) => {

	const [sidebarOpen, setSidebarOpen] = useState(false);

	const [fontFamily, setFontFamily] = useState(fontFamilyOptions[0]);
	const [fontSize, setFontsize] = useState(fontSizeOptions[0]);
	const [fontColor, setFontColor] = useState(fontColors[0]);
	const [backgroundColor, setBackgroundColor] = useState(backgroundColors[0]);
	const [contentWidth, setContentWidth] = useState(contentWidthArr[0]);

	const articleParamsFormOpen = clsx(styles.container, {
		[styles.container_open]: sidebarOpen,
	});

	const changedState = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setArticleState({
			...articleState,
			fontFamilyOption: fontFamily,
			fontColor: fontColor,
			backgroundColor: backgroundColor,
			contentWidth: contentWidth,
			fontSizeOption: fontSize
		})
		setSidebarOpen(false);
	}

	const changedStateReset = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setArticleState(defaultArticleState),
		setFontFamily(defaultArticleState.fontFamilyOption),
		setFontsize(defaultArticleState.fontSizeOption),
		setFontColor(defaultArticleState.fontColor),
		setBackgroundColor(defaultArticleState.backgroundColor),
		setContentWidth(defaultArticleState.contentWidth);
	}

	const sidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (sidebarOpen && !sidebarRef.current?.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
		}
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
	}, [sidebarOpen]);

	return (
		<>
			<ArrowButton 
				onClick={() => setSidebarOpen(!sidebarOpen)}
				isOpen={sidebarOpen}
			/>
			<aside
				className={articleParamsFormOpen}
				ref={sidebarRef}
			>
				<form 
					className={styles.form}
					onSubmit={changedState}
					onReset={changedStateReset}
				>
					<Text size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Spacing size={50} />
					<Select 
						selected={fontFamily}
						options={fontFamilyOptions}
						title='Шрифт'
						onChange={setFontFamily}
					/>
					<Spacing size={50} />
					<RadioGroup 
						title='Размер шрифта'
						name='fontSize'
						options={fontSizeOptions}
						selected={fontSize}
						onChange={setFontsize}
					/>
					<Spacing size={50} />
					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={fontColor}
						onChange={setFontColor}
					/>
					<Spacing size={50} />
					<Separator />
					<Spacing size={50} />
					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={backgroundColor}
						onChange={setBackgroundColor}
					/>
					<Spacing size={50} />
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={contentWidth}
						onChange={setContentWidth}
					/>
					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							type='reset'
						/>
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</>
	);
};
