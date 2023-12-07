import { useEffect, useState } from "react";
import { GoBack } from "../../components/GoBack";
import { GameCount } from "../../components/GameCount";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../FirebaseConfig";
import { get, ref, update } from "firebase/database";
import './Playground.css'
import Banner460 from "../../components/Ads/Banner460";
import Banner from "../../components/Ads/Banner";

export const Playground = () => {
    const [userGuess, setUserGuess] = useState("");
    const [feedback, setFeedback] = useState("");
    const [showGame, setShowGame] = useState(false);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [number, setNumber] = useState<{ num1: number, num2: number } | undefined>(undefined);
    const [showCongratsPopup, setShowCongratsPopup] = useState(false);
    const earnedAmount = 2.0;
    const [isLoading, setIsLoading] = useState(true);

    // Step 1: Initialize ad choice
    // Step 2: Check for limit
    // Step 3: If limit <= 5 && dateInDatabase == currentDate, show Game
    // Step 4: Else if dateInDatabase < currentData, change the dataInDatabase to currentDate, showGame
    // Step 5: Else Something went wrong error

    interface preCheckUpsProps {
        (uid: string): Promise<boolean>;
    }

    interface indianDateFormatterProps {
        (dateL: Date): string;
    }

    const indianDateFormat: indianDateFormatterProps = (date) => {

        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const indianDateFormatter = new Intl.DateTimeFormat('en-IN', options);


        const dateFormatResult = indianDateFormatter.format(date);

        return dateFormatResult
    }

    const handleNewGame = () => {
        const newNum1 = Math.floor(Math.random() * 20); // Generate a number between 10 and 100
        const newNum2 = Math.floor(Math.random() * 20); // Generate a number
        setNumber({
            num1: newNum1,
            num2: newNum2
        });
        setFeedback("");
        setUserGuess("");
        setIsLimitReached(false);
        setTimeout(() => {
            setShowGame(true);
        }, 5000);
    };

    const preCheckUps: preCheckUpsProps = async (uid) => {
        try {
            const snapshot = await get(ref(db, `Users/${uid}`));

            if (snapshot.exists()) {
                const limit = snapshot.val().limit;
                const dateInDatabase = snapshot.val().date;
                const todayDate = new Date();
                const [day, month, year] = dateInDatabase.split('-').map(Number);
                const formattedDateInDatabase = new Date(year, month - 1, day);
                const formattedDate = indianDateFormat(todayDate).replace(/\//g, '-');
                if (limit < 5 && dateInDatabase === formattedDate) {
                    console.log('Users allowed to access');

                    return true;
                } else if (limit <= 5 && formattedDateInDatabase < todayDate && dateInDatabase !== formattedDate) {
                    await update(ref(db, `Users/${uid}`), {
                        date: formattedDate,
                        limit: 0
                    });
                    console.log('Limit updated');

                    return true;
                } else {
                    console.log('Limit exceeded');

                    return false;
                }
            }
        } catch (error) {
            console.error('Error in preCheckUps:', error);
            return false;
        }
        return false;
    };


    useEffect(() => {
        const checkLimit = async () => {
            const user = auth.currentUser;

            if (user) {
                try {
                    const result = await preCheckUps(user.uid);

                    if (result) {
                        setIsLoading(false);

                        handleNewGame();
                    }
                    else {
                        setIsLimitReached(true);
                        setIsLoading(false)
                    }

                } catch (error) {
                    console.error('Error in preCheckUps:', error);
                }
            }
        }

        checkLimit();
    }, []);


    if (isLoading) {
        return <h1>Loading...</h1>;
    }




    const handleGuessSubmit = () => {
        const parsedGuess = parseInt(userGuess, 10);

        if (!isNaN(parsedGuess)) {
            const correctAnswer = (number?.num1 ?? 0) + (number?.num2 ?? 0);
            if (parsedGuess === correctAnswer) {
                setFeedback("Congratulations! You found the correct answer!");
                setShowCongratsPopup(true);

                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        const uid: string = user.uid;
                        const dbRef = ref(db, "Users/" + uid);

                        get(dbRef)
                            .then((snapshot) => {
                                if (snapshot.exists()) {
                                    const total_earning = parseFloat(snapshot.val().total_earning) + earnedAmount;
                                    const balance = parseFloat(snapshot.val().balance) + earnedAmount;
                                    const limit = parseInt(snapshot.val().limit) + 1;

                                    if (limit > 5) {
                                        setIsLimitReached(true)
                                    }

                                    const updatedData = {
                                        total_earning: total_earning.toFixed(2),
                                        balance: balance.toFixed(2),
                                        limit: limit
                                    };

                                    update(dbRef, updatedData);
                                } else {
                                    console.error("No data available");
                                }
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }
                });
            } else {
                setFeedback("Incorrect! Try again");
            }
        } else {
            setFeedback("Please enter a valid number.");
        }
    };

    const handleCloseGame = async () => {
        // Reset state and start a new game
        console.log(isLimitReached);

        setShowGame(true);
        setFeedback("");
        setUserGuess("");

        window.location.href = '/playground/guessthenumber'

    };

    // Render content based on limit status
    if (isLimitReached) {
        return (
            <div className="w-full h-full flex flex-col items-center pt-32">
                <p className="font-manrope">You have reached 5 / 5 limit. Come back later</p>

                <div id="banner-ad-container" className="mt-0 mb-4">
                    <Banner460 />
                </div>
            </div>
        );
    }

    return (
        <div className="px-5 sm:px-24">
            <div>
                <GoBack url="/" />
            </div>

            {/* {
                showFullSizeAd ? (
                    <div className="w-[80%] h-screen bg-blue-200 absolute top-10 shadow-lg">
                        <div className="w-full flex justify-end py-5 px-5">
                            <button className="text-sm" onClick={handleCloseFullSizeAd}>Close</button>
                        </div>
                        <div>
                            <Banner />
                        </div>
                    </div>
                )
                    : <></>
            } */}

            {showGame
                ?
                <div id="game_container" className="w-full pt-20 justify-center items-center flex flex-col gap-y-2">
                    <h2 className="font-manrope">Add the two numbers</h2>
                    <h1 className="text-3xl font-poppins">{number?.num1} + {number?.num2}</h1>

                    {feedback && <p className="font-poppins text-sm text-yellow-600">{feedback}</p>}
                    <div className="flex flex-col gap-y-8">
                        <input
                            type="text"
                            placeholder="Enter your guess"
                            value={userGuess}
                            onKeyUp={(e) => { if (e.key == 'Enter') { handleGuessSubmit() } }}
                            onChange={(e) => setUserGuess(e.target.value)}
                            className="border pl-3 py-3 w-full sm:w-80 outline-none rounded-md font-manrope mt-10 text-sm"
                        />
                        <button
                            onClick={handleGuessSubmit}
                            className="bg-indigo-600 py-2 text-white font-inter tracking-tight rounded-md"
                        > Submit Guess</button>
                    </div>
                </div>
                :
                <div id="ready_container" className="w-full h-96 flex flex-col items-center justify-center gap-y-3 transition-all duration-150 active">
                    <h1 className="font-manrope text-2xl font-semibold text-indigo-500">Are you ready?</h1>
                    <p className="font-inter text-slate-400">Guess the number between the given pair</p>

                    <div>
                        <GameCount duration={5} />
                    </div>
                </div>

            }

            <div id="ad_container">
                <Banner />
            </div>



            {/* Congrats Popup */}
            {
                showCongratsPopup && (
                    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                        <div className="bg-white p-8 rounded-md">
                            <h2 className="text-2xl font-semibold mb-4 font-manrope">Congratulations! 🎉</h2>
                            <p className="font-inter text-sm">You earned Rs {earnedAmount.toFixed(2)}</p>
                            <Banner460 />
                            <button
                                onClick={() => {
                                    setShowCongratsPopup(false);
                                    handleCloseGame();
                                }}
                                className="bg-indigo-600 text-white px-4 py-2 mt-4 rounded-md"
                            >
                                Claim it
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
