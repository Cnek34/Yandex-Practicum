import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getLoadingUser, getOrders, getOrdersUser } from '../../services/slice/user-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrders);
  const loading = useSelector(getLoadingUser);

  useEffect(() => {
    dispatch(getOrdersUser());
  }, [dispatch])

  if (loading) {
      return <Preloader />;
    }

  return <ProfileOrdersUI orders={orders} />;
};
