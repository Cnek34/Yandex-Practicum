import { TIngredient } from '@utils-types';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getIngredientsApi } from '../../utils/burger-api'

type TBurgerIngredientsSlice = {
    ingredients: TIngredient[];
    loading: boolean;
    error: string | null | undefined;
};

const initialState: TBurgerIngredientsSlice = {
    ingredients: [],
    loading: false,
    error: null
};

export const getBurgerIngredients = createAsyncThunk(
    'bureger-ingredients/getAllBurgerIngredients',
    async () => getIngredientsApi()
);

const burgerIngredientsSlice = createSlice({
    name: 'burgerIngredientsSlice',
    initialState,
    reducers: {},
    selectors: {
        getLoading: (state) => state.loading,
        getIngredients: (state) => state.ingredients
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBurgerIngredients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBurgerIngredients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getBurgerIngredients.fulfilled, (state, action) => {
                state.ingredients = action.payload;
                state.loading = false;
                state.error = null;
            });
    }
});

export const { getLoading, getIngredients } = burgerIngredientsSlice.selectors;
export const burgerIngredientsReducer = burgerIngredientsSlice.reducer;