import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getBun, getIngredient, getOrderModalData, getOrderRequest, orderBurgerUser, resetConstructor, setOrderRequest } from '../../services/slice/constructor-slice';
import { authenticatedSelector } from '../../services/slice/user-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(authenticatedSelector)
  const orderBun = useSelector(getBun);
  const orderIngredient = useSelector(getIngredient);

  const constructorItems = {
    bun: orderBun,
    ingredients: orderIngredient
  };

  const orderRequest = useSelector(getOrderRequest);

  const orderModalData = useSelector(getOrderModalData);

  const onOrderClick = () => {
    if (!isAuthenticated) return navigate('/login');
    if (!constructorItems.bun || orderRequest) return;
    dispatch(setOrderRequest(true));

    const bunId = constructorItems.bun._id;
    const ingredientsId = constructorItems.ingredients.map(
      (ingredient) => ingredient._id
    );
    const order = [bunId, ...ingredientsId, bunId];
    dispatch(orderBurgerUser(order));
  };
  const closeOrderModal = () => {
    dispatch(setOrderRequest(false));
    dispatch(resetConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );


  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
