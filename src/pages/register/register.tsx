import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { authenticatedSelector, getError, registerUser } from '../../services/slice/user-slice';
import { Navigate } from 'react-router-dom';

export const Register: FC = () => {
  const [name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAuthenticated = useSelector(authenticatedSelector);
  const error = useSelector(getError)
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }))
  };

  if (isAuthenticated) {
    return(
      <Navigate 
        to={'/'}      
      />
    );
  }

  return (
    <RegisterUI
      errorText={error?.toString()}
      email={email}
      userName={name}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
