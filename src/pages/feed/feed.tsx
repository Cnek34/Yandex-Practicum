import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getAllFeeds, getFeeds, getLoadingFeeds } from '../../services/slice/feed-slice';

export const Feed: FC = () => {

  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getAllFeeds);
  const loding = useSelector(getLoadingFeeds);

  if (!orders.length || loding) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />
  )
};
