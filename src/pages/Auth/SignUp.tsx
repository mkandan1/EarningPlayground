import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '../../FirebaseConfig'
import { ref, set, update, get, child } from "firebase/database"

export const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [feedback, setFeedback] = useState('');

    const validateEmail = () => {
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return regex.test(email);
    };

    const validatePassword = () => {
        return password.length >= 8; // You can adjust this based on your requirements
    };

    const validateName = () => {
        return name.trim().length > 0;
    };

    const handleLogin = () => {
        setIsLoggingIn(true);

        const emailError = !validateEmail() ? 'Please enter a valid email address.' : '';
        const passwordError = !validatePassword() ? 'Password must be at least 8 characters.' : '';
        const nameError = !validateName() ? 'Please enter your name.' : '';

        if (emailError || passwordError || nameError) {
            setFeedback(`${emailError}${passwordError ? ' ' + passwordError : ''}${nameError ? ' ' + nameError : ''}`);
            setIsLoggingIn(false);
            return;
        }

        if (inviteCode.toString().length === 6) {
            const referralRef = ref(db);
            get(child(referralRef, `Referrals/${inviteCode}`)).then((snapshot) => {
                if (!snapshot.exists()) {
                    setFeedback("Enter valid Invite Code")
                    setIsLoggingIn(false)
                }
                else {
                    createUserWithEmailAndPassword(auth, email, password)
                        .then((userCred) => {
                            updateProfile(userCred.user, { displayName: name }).then(() => {

                                const currentDate = new Date().toISOString().split('T')[0];
                                const userInviteCode = Math.floor(Math.random() * 999999);
                                const code = userInviteCode.toString().padStart(6, '0');
                                const dbRef = ref(db, 'Users/' + userCred.user.uid)
                                set(dbRef, {
                                    balance: 0,
                                    invite_count: 0,
                                    payment_history: [0],
                                    total_earning: 0,
                                    invite_code: code,
                                    date: currentDate,
                                    limit: 0,
                                })


                                const refRef = ref(db, 'Referrals/' + code);

                                const data = {
                                    uid: userCred.user.uid,
                                }

                                update(refRef, data);

                                // Update invite code of inviter
                                const inviteruid = snapshot.val().uid;

                                const inviterDataRef = ref(db, 'Users/' + inviteruid);

                                get(inviterDataRef).then((snapshot) => {
                                    if (snapshot.exists()) {
                                        const inviteCount = parseInt(snapshot.val().invite_count) + 1;

                                        const newInviteCount = {
                                            invite_count: inviteCount
                                        }
                                        update(inviterDataRef, newInviteCount)

                                        setTimeout(() => {
                                            window.location.href = '/'
                                        }, 2000)

                                    }
                                })
                            })
                                .catch((updateProfileError) => {
                                    console.error('Error updating profile:', updateProfileError);
                                });
                        })
                        .catch((err) => {
                            setFeedback(err.message)
                            setIsLoggingIn(false);
                            console.error(err)
                        })
                }
            })
        }
        else {

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCred) => {
                    updateProfile(userCred.user, { displayName: name }).then(() => {

                        const userInviteCode = Math.floor(Math.random() * 999999);
                        const code = userInviteCode.toString().padStart(6, '0');
                        const dbRef = ref(db, 'Users/' + userCred.user.uid)
                        set(dbRef, {
                            balance: 0,
                            invite_count: 0,
                            payment_history: [{date: 0, amount: 0, status: 0}],
                            total_earning: 0,
                            invite_code: code
                        })


                        const refRef = ref(db, 'Referrals/' + code);

                        const data = {
                            uid: userCred.user.uid,
                        }

                        update(refRef, data);

                        setTimeout(() => {
                            window.location.href = '/'
                        }, 2000)

                    })
                        .catch((updateProfileError) => {
                            console.error('Error updating profile:', updateProfileError);
                        });
                })
                .catch((err) => {
                    setFeedback(err.message)
                    setIsLoggingIn(false);
                    console.error(err)
                })
        }


    }

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.hash.slice(1));
        const codeValue = urlParams.get('code');
        setInviteCode(codeValue ?? '')
    })

    return (
        <div className="w-full h-screen flex justify-center pt-52 px-2">
            <div>
            <h1 className="text-3xl tracking-tight font-manrope">Get <span className="text-indigo-500">Rs 10</span> in just 10 mins</h1>

                <div className="pt-20">
                    <h2 className="font-poppins text-lg mt-10">Sign Up</h2>

                    <input type="text" placeholder="Name" className="border py-2 px-2 w-full font-manrope rounded-md outline-none mt-5" onChange={(e) => setName(e.target.value)}></input>
                    <input type="email" placeholder="Email" className="border py-2 px-2 w-full font-manrope rounded-md outline-none mt-5" onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" placeholder="Password" className="border py-2 px-2 w-full font-manrope rounded-md outline-none mt-5" onChange={(e) => setPassword(e.target.value)}></input>
                    <input type="number" placeholder="Referral Code" className="border py-2 px-2 w-full font-manrope rounded-md outline-none mt-5" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)}></input>
                    <button className={`${isLoggingIn ? 'bg-indigo-300' : 'bg-indigo-600'} w-full mt-5 py-2 text-white font-inter tracking-tight rounded-md`} onClick={handleLogin}>{isLoggingIn ? 'Please wait' : 'Create an account'}</button>
                    <p className="text-red-500">{feedback}</p>
                    <div className="flex justify-center mt-5">
                        <p className="w-[80%] text-center">By logging your account you're agree to our <Link to='/platform/terms' className="text-blue-500">terms of condition</Link> & <Link to='/platform/privacy' className="text-blue-500">privacy policy</Link></p>
                    </div>

                    <p className="font-manrope text-center mt-10">Already have an account? <Link to='/' className="text-blue-500">Login</Link></p>
                </div>
            </div>
        </div>
    )
}
