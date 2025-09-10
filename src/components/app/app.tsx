import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { ProtectedRoute } from '../protected-route/index';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getBurgerIngredients } from '../../services/slice/burger-ingredients-slice';
import { getFeeds } from '../../services/slice/feed-slice';
import { checkUserAuth } from '../../services/slice/user-slice';
  

const App = () => {
  const location = useLocation();
  const background = location.state?.background;

  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBurgerIngredients());
    dispatch(getFeeds());
    dispatch(checkUserAuth());
  }, [dispatch])

 return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<ProtectedRoute onlyUnAuth><Login /></ProtectedRoute>} />
        <Route path='/register' element={<ProtectedRoute><Register /></ProtectedRoute>} />
        <Route path='/forgot-password' element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
        <Route path='/reset-password' element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/profile/orders' element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />
        <Route path='*' element={<NotFound404 />} />

        <Route
          path='/ingredients/:id'
          element={
            <Modal title={'Детали ингредиента'} onClose={() => navigate('/')}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <Modal title={`#${location.pathname.split('/').pop()}`} onClose={() => navigate('/feed')}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={'Детали заказа'}
                  onClose={() => navigate('/profile/orders')}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />

      </Routes>

      {background &&
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${location.pathname.split('/').pop()}`} onClose={() => navigate('/feed')}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={() => navigate('/')}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={'Детали заказа'}
                  onClose={() => navigate('/profile/orders')}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      }
    </div>
  );
}

export default App;
