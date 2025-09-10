import { orderBurgerApi } from "@api";
import { createAsyncThunk, createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { TConstructorIngredient, TIngredient, TOrder } from "@utils-types";

type TConstructorSlice = {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
    loading: boolean;
    orderRequest: boolean;
    orderModalData: TOrder | null;
    error: string | null | undefined;
};

const initialState: TConstructorSlice = {
    bun: null,
    ingredients: [],
    loading: false,
    orderRequest: false,
    orderModalData: null,
    error: null
};

export const orderBurgerUser = createAsyncThunk(
    'burderConstructor/orderBurgerUser',
    async (order: string[]) => orderBurgerApi(order)
)

const constructorSlice = createSlice({
    name: 'burderConstructor',
    initialState,
    reducers: {
        addIngredient: {
            reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
                if (action.payload.type === 'bun') {
                    state.bun = action.payload;
                } else {
                    state.ingredients.push(action.payload);
                }
            },
            prepare: (ingredient: TIngredient) => {
                const id = nanoid();
                return { payload: {...ingredient, id } };
            }
        },
        removeIngredient: (state, action: PayloadAction<string>) => {
            state.ingredients = state.ingredients.filter((ingredient) => ingredient.id != action.payload)
        },
        moveUpIngredient: (state, action) => {            
            [state.ingredients[action.payload], state.ingredients[action.payload - 1]] = [state.ingredients[action.payload - 1], state.ingredients[action.payload]];
        },
        moveDownIngredient: (state, action) => {
            [state.ingredients[action.payload], state.ingredients[action.payload + 1]] = [state.ingredients[action.payload + 1], state.ingredients[action.payload]];
        },
        setOrderRequest: (state, action) => {
            state.orderRequest = action.payload;
        },
        resetConstructor: (state) => {
            state.orderModalData = null;
            state.bun = null;
            state.ingredients = [];
        }
    },
    selectors: {
        getBun: (state) => state.bun,
        getIngredient: (state) => state.ingredients,
        getOrderRequest: (state) => state.orderRequest,
        getOrderModalData: (state) => state.orderModalData
    },
    extraReducers: (builder) => {
        builder
            .addCase(orderBurgerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(orderBurgerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(orderBurgerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.orderModalData = action.payload.order;
                state.orderRequest = false;
            })
    }
})

export const { addIngredient, removeIngredient, moveUpIngredient, moveDownIngredient, setOrderRequest, resetConstructor } = constructorSlice.actions;
export const { getBun, getIngredient, getOrderRequest, getOrderModalData } = constructorSlice.selectors;
export const constructorSliceReducer = constructorSlice.reducer;