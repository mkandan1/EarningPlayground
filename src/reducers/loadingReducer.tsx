import { AnyAction } from "redux";

// userReducer.ts
export interface LoadingState {
    isLoading: boolean;
}

const initialState: LoadingState = {
    isLoading: false,
};

const loadingReducer = (state: LoadingState = initialState, action: AnyAction): LoadingState => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: true,
            };
        case 'REMOVE_LOADING':
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default loadingReducer;
