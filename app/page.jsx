"use client";
import { appContext } from "@/context/AppContext";
import { MdLightMode, MdNightlight } from "react-icons/md";
import React, { useContext } from "react";
import Link from "next/link";
import SmallLoader from "@/components/SmallLoader";

const HomePage = () => {
    const { dark, user, login, setDark, userLoading } = useContext(appContext);
    const className = {
        btn: " rounded-full active:scale-95 transition-all",
    };
    
    return (
        <div
            className={`flex items-center transition-all duration-300 ${
                dark && "dark"
            } justify-center w-full h-[100vh] dark:bg-black dark:text-neutral-200`}
        >
            <div>
                <h1 className="transition-all text-6xl font-bold mb-2">
                    copy_code
                </h1>
                <h3 className="text-lg mb-5 transition-all">
                    Store and Share Code Snippets
                </h3>

                <div className="flex gap-2 items-center">
                    {user ? (
                        <Link
                            href={"/profile"}
                            className={`${className.btn} hover:bg-indigo-400 dark:hover:bg-neutral-400 px-5 py-2 bg-indigo-500 dark:bg-neutral-300 text-white dark:text-black`}
                        >
                            Go To Profile
                        </Link>
                    ) : (
                        <button
                            onClick={login}
                            className={`${className.btn} flex items-center gap-2 hover:bg-indigo-400 dark:hover:bg-neutral-400 px-5 py-2 bg-indigo-500 dark:bg-neutral-300 text-white dark:text-black`}
                        >
                            Login {userLoading && <SmallLoader />}
                        </button>
                    )}
                    <button
                        onClick={() => setDark((p) => !p)}
                        className={`p-2 text-2xl ${className.btn} hover:bg-indigo-400 dark:hover:bg-neutral-900 bg-indigo-300 dark:bg-neutral-800`}
                    >
                        {dark ? <MdNightlight /> : <MdLightMode />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
