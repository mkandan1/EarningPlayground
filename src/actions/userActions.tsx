// userActions.ts
import { AnyAction, Dispatch } from 'redux';

export const loginUser = () => (dispatch: Dispatch<AnyAction>) => {
  // Simulate login logic (replace this with actual authentication)
  dispatch({ type: 'LOGIN_USER' });
};

export const logoutUser = () => (dispatch: Dispatch<AnyAction>) => {
  // Simulate logout logic
  dispatch({ type: 'LOGOUT_USER' });
};
