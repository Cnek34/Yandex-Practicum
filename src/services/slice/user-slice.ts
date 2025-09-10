import { TLoginData, loginUserApi, TRegisterData, registerUserApi, updateUserApi, getUserApi, logoutApi, getOrdersApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from "../../utils/cookie";


type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  loginUserError: string | null | undefined; 
  loginUserRequest: boolean;
  orders: TOrder[];

}

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false,
  orders: []
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData) => {
      const data = await loginUserApi({ email, password });
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, name, password }: TRegisterData) => {
    return await registerUserApi({ email, name, password });
  } 
);

export const updateDataUser = createAsyncThunk(
  'user/updateDataUser',
  async (user: Partial<TRegisterData>) => {
    return await updateUserApi(user);
  }
);

export const getUserAuth = createAsyncThunk(
  'user/getUserAuth',
  async () => await getUserApi()
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUserAuth()).finally(() => {
        dispatch(authChecked()); 
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  (_, { dispatch }) => {
    logoutApi()
      .then(() => {
        localStorage.clear();
        deleteCookie('accessToken');
        dispatch(userLogout());
      })
      .catch(() => {
        console.log('Ошибка выполнения выхода');
      });
  }
);

export const getOrdersUser = createAsyncThunk(
  'user/getOrdersUser',
  async () => await getOrdersApi()
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: { 
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.data = null;
    }
  },
  selectors: {
    authenticatedSelector: (state) => state.isAuthenticated,
    getError: (state) => state.loginUserError,
    getNameUser: (state) => state.data?.name,
    getDataUser: (state) => state.data,
    getLoadingUser: (state) => state.loginUserRequest,
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    getOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
        .addCase(loginUser.pending, (state) => {
            state.loginUserRequest = true;
            state.loginUserError = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loginUserRequest = false;
            state.loginUserError = action.error.message;
            state.isAuthChecked = false;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.data = action.payload.user;
            state.loginUserRequest = false;
            state.isAuthenticated = true;
            state.isAuthChecked = true;
        })
        .addCase(registerUser.pending, (state) => {
            state.loginUserRequest = true;
            state.loginUserError = null;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loginUserRequest = false;
            state.loginUserError = action.error.message;
            state.isAuthChecked = false;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.data = action.payload.user;
            state.loginUserRequest = false;
            state.isAuthenticated = true;
            state.isAuthChecked = true;
        })
        .addCase(updateDataUser.pending, (state) => {
            state.loginUserRequest = true;
            state.loginUserError = null;
        })
        .addCase(updateDataUser.rejected, (state, action) => {
            state.loginUserRequest = false;
            state.loginUserError = action.error.message;
        })
        .addCase(updateDataUser.fulfilled, (state, action) => {
            state.data = action.payload.user;
            state.loginUserRequest = false;
            state.isAuthenticated = true;
            state.isAuthChecked = true;
        })
        .addCase(getUserAuth.pending, (state) => {
            state.loginUserRequest = true;
            state.loginUserError = null;
        })
        .addCase(getUserAuth.rejected, (state, action) => {
            state.loginUserRequest = false;
            state.loginUserError = action.error.message;
        })
        .addCase(getUserAuth.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.isAuthChecked = true;
            state.loginUserRequest = false;
            state.data = action.payload.user;
        })
        .addCase(logoutUser.pending, (state) => {
            state.loginUserRequest = true;
            state.loginUserError = null;
        })
        .addCase(logoutUser.rejected, (state, action) => {
            state.loginUserRequest = false;
            state.loginUserError = action.error.message;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.loginUserRequest = false;
            state.data = null;
        })
        .addCase(getOrdersUser.pending, (state) => {
            state.loginUserRequest = true;
            state.loginUserError = null;
        })
        .addCase(getOrdersUser.rejected, (state, action) => {
            state.loginUserRequest = false;
            state.loginUserError = action.error.message;
        })
        .addCase(getOrdersUser.fulfilled, (state, action) => {
            state.loginUserRequest = false;
            state.orders = action.payload;
        })
  }
});

export const { authChecked, userLogout } = userSlice.actions;
export const { authenticatedSelector, getError, getNameUser, getDataUser, getLoadingUser, isAuthCheckedSelector, getOrders }  = userSlice.selectors;
export const userReducer = userSlice.reducer;