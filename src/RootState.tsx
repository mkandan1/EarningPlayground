import { LoadingState } from './reducers/loadingReducer';
import { UserState } from './reducers/userReducer';

interface RootState {
    userReducer: UserState;
    loadingReducer: LoadingState;
}

export default RootState;