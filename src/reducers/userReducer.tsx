import { AnyAction } from "redux";

// userReducer.ts
export interface UserState {
    isAuthenticated: boolean;
}

const initialState: UserState = {
    isAuthenticated: false,
};

const userReducer = (state: UserState = initialState, action: AnyAction): UserState => {
    switch (action.type) {
        case 'LOGIN_USER':
            return {
                ...state,
                isAuthenticated: true,
            };
        case 'LOGOUT_USER':
            return {
                ...state,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};

export default userReducer;
