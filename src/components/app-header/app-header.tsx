import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getNameUser } from '../../services/slice/user-slice';

export const AppHeader: FC = () => {
    const name = useSelector(getNameUser);

    return (
        <AppHeaderUI userName={name} />
    );
}
