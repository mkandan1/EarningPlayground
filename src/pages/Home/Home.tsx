import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../FirebaseConfig";
import { ref, get } from "firebase/database";
import Banner460 from "../../components/Ads/Banner460";

export const Home = () => {
    const [name, setName] = useState("");
    const [totalEarning, setTotalEarning] = useState(0.00);
    const [balance, setWalletBalance] = useState(0.00)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                let userName = user.displayName;
                setName(userName?? '');
                const dbRef = ref(db, 'Users/' + user.uid);

                get(dbRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const balance = snapshot.val().balance;
                        const total_earning = snapshot.val().total_earning;
                        setWalletBalance(balance);
                        setTotalEarning(total_earning);
                    }
                })
            }
        })
    })
    return (
        <div className="px-5 sm:px-24">
            <div className='mt-10'>
                <div>
                    <h4 className="font-inter text-sm text-gray-600">Home</h4>
                </div>
            </div>

            <div className="mt-5">
                <h2 className="font-manrope font-semibold text-xl tracking-tight">Welcome back, <span className="font-light">{name}</span></h2>

                <div className="flex gap-x-10 flex-wrap">
                    <div className="w-full sm:w-36 px-5 py-3 mt-5 rounded-md bg-white border flex flex-col gap-y-2">
                        <h5 className="font-inter text-sm font-medium text-slate-500">Total Earning</h5>
                        <p className="font-manrope text-xl">₹ {totalEarning}</p>
                    </div>
                    <div className="w-full sm:w-32 px-5 py-3 mt-5 rounded-md bg-white border flex flex-col gap-y-2">
                        <h5 className="font-inter text-sm font-medium text-slate-500">Balance</h5>
                        <p className="font-manrope text-xl">₹ {balance}</p>
                    </div>
                    <div className="w-full sm:w-52 px-5 py-3 mt-5 rounded-md bg-white border flex flex-col gap-y-2">
                        <h5 className="font-inter text-sm font-medium text-slate-500">Next Payment</h5>
                        <p className="font-manrope text-xl">31 Dec, 2023</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-start">
                <Banner460 />
            </div>

            <div className="mt-10">
                <div>
                    <h2 className="font-poppins tracking-tight text-gray-500">Latest Games</h2>
                </div>
                <div className="mt-5">
                    <div className="w-full sm:w-52 h-36 bg-indigo-600 border flex flex-col py-8 px-5 rounded-md">
                        <h4 className="font-manrope font-medium text-white">Guess The Number</h4>
                        <Link to='/playground/guessthenumber' className="bg-white rounded-sm px-3 py-2 text-sm font-inter mt-2 w-24 text-center">Play Now</Link>
                    </div>
                </div>
            </div>

            <div>
            </div>
        </div>
    )
}
