import { Dispatch, AnyAction } from "redux";

export const SET_LOADING = () => (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: 'SET_LOADING' });
}

export const REMOVE_LOADING = () => (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: 'REMOVE_LOADING' });
}