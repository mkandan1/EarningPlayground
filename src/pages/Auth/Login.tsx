import { useState } from "react"
import { Link } from "react-router-dom"
import { signInWithEmailAndPassword } from 'firebase/auth'
import {auth} from '../../FirebaseConfig'

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleLogin = () => {
        setIsLoggingIn(true);

        if(email == '' || password == ''){
            alert('Kindly enter your email and pasword!')
            setIsLoggingIn(false)
            return
        }

        signInWithEmailAndPassword(auth, email, password)
        .then(()=> {
            window.location.href = '/'
        })
        .catch((err)=> {
            setFeedback(err.message)
            setIsLoggingIn(false)
        })
    }

    return (
        <div className="w-full h-screen flex justify-center pt-52 px-2">
            <div>
                <h1 className="text-3xl tracking-tight font-manrope">Get <span className="text-indigo-500">Rs 10</span> in just 10 mins</h1>

                <div className="pt-20">
                    <h2 className="font-poppins text-lg mt-10">Login</h2>

                    <input type="email" placeholder="Email" className="border py-2 px-2 w-full font-manrope rounded-md outline-none mt-5" onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" placeholder="Password" className="border py-2 px-2 w-full font-manrope rounded-md outline-none mt-5" onChange={(e) => setPassword(e.target.value)}></input>
                    <button className={`${isLoggingIn ? 'bg-indigo-300' : 'bg-indigo-600'} w-full mt-5 py-2 text-white font-inter tracking-tight rounded-md`} onClick={handleLogin}>{isLoggingIn ? 'Please wait' : 'Login'}</button>
                    <p className="text-red-500">{feedback}</p>
                    <div className="flex justify-center mt-5">
                        <p className="w-[80%] text-center">By logging your account you're agree to our <Link to='/platform/terms' className="text-blue-500">terms of condition</Link> & <Link to='/platform/privacy' className="text-blue-500">privacy policy</Link></p>
                    </div>

                    <p className="font-manrope text-center mt-10">Don't have an account? <Link to='/signup' className="text-blue-500">Signup</Link></p>
                </div>
            </div>
        </div>
    )
}
