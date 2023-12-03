import React, { useEffect, useState } from "react";
import { GoBack } from "../../components/GoBack";
import { GameCount } from "../../components/GameCount";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../FirebaseConfig";
import { get, ref, update } from "firebase/database";
import Banner from "../../components/Ads/Banner";
import Banner460 from "../../components/Ads/Banner460";
import NativeBanner from "../../components/Ads/NativeBanner";

export const Playground = () => {
    const [userGuess, setUserGuess] = useState("");
    const [feedback, setFeedback] = useState("");
    const [showGame, setShowGame] = useState(false);
    const [secretNumber, setSecretNumber] = useState<number | undefined>(undefined);
    const [showCongratsPopup, setShowCongratsPopup] = useState(false);
    const earnedAmount = 0.40;
    const adChoice = Math.floor(Math.random() * 3) + 1;

    useEffect(() => {
        handleNewGame();
    }, []);

    const handleNewGame = () => {
        const readyContainer = document.getElementById("ready_container");

        if (readyContainer?.classList.contains("opacity-0")) {
            setTimeout(() => {
                if (readyContainer) {
                    readyContainer.classList.add("opacity-100");
                }
            }, 0);

            setTimeout(() => {
                if (readyContainer) {
                    readyContainer.classList.remove("opacity-100");
                    readyContainer.classList.add("opacity-0");
                }
            }, 5000);

            setTimeout(() => {
                const gameContainer = document.getElementById("game_container");
                if (readyContainer && gameContainer) {
                    readyContainer.classList.remove("opacity-100");
                    readyContainer.classList.add("opacity-0");
                    gameContainer.classList.remove("opacity-0");
                    gameContainer.classList.add("opacity-100");

                    const generatedNumber = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
                    setSecretNumber(generatedNumber);
                    setShowGame(true);
                }
            }, 6000);
        } else {
            setTimeout(() => {
                if (readyContainer) {
                    readyContainer.classList.remove("opacity-100");
                    readyContainer.classList.add("opacity-0");
                }
            }, 5000);

            setTimeout(() => {
                const gameContainer = document.getElementById("game_container");

                gameContainer?.classList.remove("opacity-0");
                gameContainer?.classList.add("opacity-100");

                const generatedNumber = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
                setSecretNumber(generatedNumber);
                setShowGame(true);
            }, 5500);
        }
    };

    const handleGuessSubmit = () => {
        const parsedGuess = parseInt(userGuess, 10);

        if (!isNaN(parsedGuess)) {
            if (parsedGuess === secretNumber) {
                setFeedback("Congratulations! You guessed the correct number!");
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

                                    const updatedData = {
                                        total_earning: total_earning.toFixed(2),
                                        balance: balance.toFixed(2),
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
            } else if (parsedGuess < secretNumber!) {
                setFeedback("Your guess is too low. Try again!");
            } else {
                setFeedback("Your guess is too high. Try again!");
            }
        } else {
            setFeedback("Please enter a valid number.");
        }
    };

    const handleEnterPress: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") {
            handleGuessSubmit();
        }
    };

    const handleCloseGame = () => {
        // Reset state and start a new game
        setShowGame(false);
        setFeedback("");
        setUserGuess("");
        handleNewGame();
    };

    return (
        <div className="px-5 sm:px-24">
            <div>
                <GoBack url="/" />
            </div>

            {showGame ? (
                <div id="game_container" className="w-full pt-20 justify-center items-center flex flex-col gap-y-2">
                    <h2 className="font-manrope">Guess a number between</h2>
                    <h1 className="text-3xl font-poppins">10 - 100</h1>
                    <div
                id="banner-ad-container"
                className="mt-0 mb-4"
            >
                {
                    adChoice > 2 ? (
                        <Banner />
                    ) : (
                        <>
                            {
                                adChoice == 2 ? (
                                    <Banner460 />
                                ) : (
                                    <NativeBanner />
                                )
                            }
                        </>

                    )
                }
            </div>

                    {feedback && <p className="font-poppins text-sm text-yellow-600">{feedback}</p>}
                    <div className="flex flex-col gap-y-8">
                        <input
                            type="text"
                            placeholder="Enter your guess"
                            value={userGuess}
                            onKeyUp={handleEnterPress}
                            onChange={(e) => setUserGuess(e.target.value)}
                            className="border pl-3 py-3 w-full sm:w-80 outline-none rounded-md font-manrope mt-10 text-sm"
                        />
                        <button
                            onClick={handleGuessSubmit}
                            className="bg-indigo-600 py-2 text-white font-inter tracking-tight rounded-md"
                        >
                            Submit Guess
                        </button>

                    </div>
                </div>
            ) : (
                <div id="ready_container" className="w-full h-96 flex flex-col items-center justify-center gap-y-3 transition-all duration-150 opacity-100">
                    <h1 className="font-manrope text-2xl font-semibold text-indigo-500">Are you ready?</h1>
                    <p className="font-inter text-slate-400">Guess the number between the given pair</p>

                    <div>
                        <GameCount duration={5} />
                    </div>
                </div>
            )}

            


            {/* Congrats Popup */}
            {
                showCongratsPopup && (
                    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                        <div className="bg-white p-8 rounded-md">
                            <h2 className="text-2xl font-semibold mb-4 font-manrope">Congratulations! 🎉</h2>
                            <p className="font-inter text-sm">You earned Rs {earnedAmount.toFixed(2)}</p>
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
