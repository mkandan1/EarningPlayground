import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { auth } from '../../FirebaseConfig'
import NativeBanner from '../../components/Ads/NativeBanner'

const MyAccount = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')

    useEffect(()=> {
        onAuthStateChanged(auth, (user)=> {
            if(user){
                let displayName = user.displayName;
                let email = user.email;
                setName(displayName);
                setEmail(email)
            }
        })
    })
    return (
        <div className='w-full pt-32 flex justify-center items-center flex-col'>
            <div className='flex flex-col'>
                <div className="bg-indigo-600 p-5 rounded-full cursor-pointer">
                    <FaUser className="text-white text-xl" />
                </div>
            </div>
            <div className='text-center'>
                <p className='font-poppins mt-5'>{name}</p>
                <p className='font-poppins mt-5'>{email}</p>
                
                <p className='text-center text-gray-400 font-manrope mt-10'>No data</p>
                <NativeBanner/>
            </div>
        </div>
    )
}

export default MyAccount