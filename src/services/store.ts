import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { burgerIngredientsReducer } from './slice/burger-ingredients-slice';
import { feedsReducer } from './slice/feed-slice';
import { userReducer } from './slice/user-slice';
import { constructorSliceReducer } from './slice/constructor-slice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
    burgerIngredientsSlice: burgerIngredientsReducer,
    feedSlice: feedsReducer,
    user: userReducer,
    burderConstructor: constructorSliceReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
