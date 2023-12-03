
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css'
import { Home } from './pages/Home/Home';
import { Header } from './components/Header';
import { Playground } from './pages/playground/Playground';
import { Login } from './pages/Auth/Login';
import { SignUp } from './pages/Auth/SignUp';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './FirebaseConfig';
import { useEffect } from 'react';
import { loginUser, logoutUser } from './actions/userActions';
import RootState from './RootState';
import { Loading } from './components/Loading';
import { REMOVE_LOADING, SET_LOADING } from './actions/loadingActions';
import MyAccount from './pages/MyAccount/MyAccount';
import { Withdraw } from './pages/Withdraw/Withdraw';
import { Invite } from './pages/invite/Invite';

function App() {
  const isAuthenticated = useSelector((state: RootState) => (state.userReducer.isAuthenticated));
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loadingReducer.isLoading);


  useEffect(() => {
    dispatch(SET_LOADING());
    // Use Firebase observer to check auth status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch(loginUser());
        dispatch(REMOVE_LOADING());
      } else {
        // User is signed out
        dispatch(logoutUser());
        dispatch(REMOVE_LOADING());
      }
    });

    // Cleanup the observer when component unmounts
    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    )
  }

  return (
    <BrowserRouter>
      {
        isAuthenticated ?
          <>
            <Header />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/playground/guessthenumber' element={<Playground />} />
              <Route path='/myaccount' element={<MyAccount />} />
              <Route path='/withdraw' element={<Withdraw />} />
              <Route path='/invite' element={<Invite />} />
            </Routes>
          </> :
          <Routes>
            <Route path='/signup' element={<SignUp />} />
            <Route path='/*' element={<Login />} />
          </Routes>
      }
    </BrowserRouter>
  )
}

export default App
