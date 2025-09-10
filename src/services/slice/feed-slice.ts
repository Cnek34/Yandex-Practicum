import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';

type TFeedSlice = {
    orders: TOrder[];
    total: number;
    totalToday: number;
    loading: boolean;
    error: string | null | undefined;
};

const initialState: TFeedSlice = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: true,
    error: null
};

export const getFeeds = createAsyncThunk(
    'feeds/getFeeds',
    async () => getFeedsApi()
);

const feedSlice = createSlice({
    name: 'feedSlice',
    initialState,
    reducers: {},
    selectors: {
        getLoadingFeeds: (state) => state.loading,
        getAllFeeds: (state) => state.orders,
        getTotal: (state) => state.total,
        getTotalToday: (state) => state.totalToday
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFeeds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeeds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getFeeds.fulfilled, (state, action) => {
                state.orders = action.payload.orders;
                state.loading = false;
                state.error = null;
                state.total = action.payload.total;2
                state.totalToday = action.payload.totalToday;
            })
    }
});

export const { getLoadingFeeds, getAllFeeds, getTotal, getTotalToday } = feedSlice.selectors;
export const feedsReducer = feedSlice.reducer;