import { Link } from "react-router-dom"
import { FaUser, FaWallet } from 'react-icons/fa'
import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../FirebaseConfig";
import { useDispatch } from "react-redux";
import { logoutUser } from "../actions/userActions";
import { ref, get } from "firebase/database";

export const Header = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const dispatch = useDispatch();

    useEffect(()=> {
        onAuthStateChanged(auth, (user)=>{
            if(user){

                const dbRef = ref(db, 'Users/'+user.uid);

                get(dbRef).then((snapshot)=> {
                    if(snapshot.exists()){
                        const balance = snapshot.val().balance;
                        setWalletBalance(balance);
                    }
                })
            }
        })
    })

    const handleLogOut = () => {
        signOut(auth).then(()=> {
            dispatch(logoutUser());
        }).catch((err)=>{
            console.error(err.message);
        })
    }

    return (
        <header className='w-full h-16 sm:h-20 bg-white px-5 sm:px-24 flex justify-between items-center'>
            <Link to='/' className='font-manrope font-bold tracking-tight cursor-pointer'>IQ<span className='text-indigo-600'>Playground</span></Link>

            <div>
                {
                    true ?
                        <div className="flex justify-between items-center gap-x-10">
                            <div>
                                <p className="font-inter text-sm font-medium flex gap-x-2 items-center"><FaWallet className="text-indigo-600"/> <span className="font-light">Wallet: ₹ {walletBalance}</span></p>
                            </div>
                            <div className="bg-indigo-600 p-2 rounded-full cursor-pointer" onClick={() => setToggleMenu((prev) => !prev)}>
                                <FaUser className="text-white" />
                            </div>
                        </div> :
                        <Link to='/login' className="font-manrope text-sm font-medium">Login | Sign Up</Link>

                }

                {
                    toggleMenu ?
                        <div className="absolute mt-5 right-5 bg-white px-4 py-3 border">
                            <ul>
                                <li><Link to="/myaccount" className="font-manrope text-sm tracking-tight mt-1">My Account</Link></li>
                                <li><Link to="/withdraw" className="font-manrope text-sm tracking-tight mt-1">Withdraw</Link></li>
                                <li><Link to="/invite" className="font-manrope text-sm tracking-tight mt-1">Invite Friends</Link></li>
                                <li><Link to="#" className="font-manrope text-sm tracking-tight text-red-500 mt-1" onClick={handleLogOut}>Log out</Link></li>
                            </ul>
                        </div>
                        :
                        <span></span>
                }
            </div>
        </header>
    )
}
