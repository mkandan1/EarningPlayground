import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { auth, db } from '../../FirebaseConfig'
import { get, ref } from 'firebase/database'
import { FaPeopleCarry, FaShare } from 'react-icons/fa'

export const Invite = () => {
    const [inviteCount, setInviteCount] = useState(0);
    const [inviteCode, setInviteCode] = useState(0);

    const linkRef = useRef(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;

                const userDataRef = ref(db, 'Users/' + uid);

                get(userDataRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const count = snapshot.val().invite_count;
                        const code = snapshot.val().invite_code;
                        setInviteCount(count)
                        setInviteCode(code)
                    }
                })
            }
        })
    })

    const handleCopy = () => {
        if (linkRef.current) {
            const range = document.createRange();
            range.selectNode(linkRef.current);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            document.execCommand('copy');

            selection.removeAllRanges();

            // Set state to indicate that the link has been copied
            setIsCopied(true);

            // Reset the copied state after a short delay
            setTimeout(() => {
                setIsCopied(false);
            }, 1500);
        }
    };
    return (
        <div className='w-full h-screen pt-52 flex flex-col items-center'>
            <div className="text-center flex flex-col items-center gap-y-2">
                <FaShare className="text-4xl text-indigo-600" />
                <h5 className='font-manrope text-lg font-medium tracking-tight'>Invite your friends</h5>
                <p className='font-poppins text-sm text-slate-400 mt-1'>Use below code to refer a friend</p>

                <div className='bg-white w-32 h-10 flex justify-center items-center font-poppins border rounded-md mt-2'>
                    {inviteCode}
                </div>
                {inviteCode != 0 ? <>
                    <p className="bg-gray-200 p-2 rounded-md font-manrope text-sm px-3" ref={linkRef}>
                        http://{window.location.host}/signup#code={inviteCode}
                    </p>
                    <button
                        onClick={handleCopy}
                        className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded-md ${isCopied ? 'bg-green-500' : ''
                            }`}
                    >
                        {isCopied ? 'Copied!' : 'Share'}
                    </button>
                </> : <><span>Loading...</span></>}
            </div>

            <div className='mt-10'>
                <p className='font-manrope'>You have invited: {inviteCount}</p>
            </div>
        </div>
    )
}
