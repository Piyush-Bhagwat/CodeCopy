"use client";
import { appContext } from "@/context/AppContext";
import { createNewBoard } from "@/firebase/firebase.db";
import { useRouter } from "next/router";
import React, { useContext } from "react";

const NewBoardPage = () => {
    const { login, user, newBoard, dark } = useContext(appContext);
    const className = {
        btn: "dark:hover:bg-neutral-800 dark:bg-neutral-700 dark:text-white bg-indigo-200 hover:bg-indigo-300 dark:hover:shadow-md active:scale-95 transition-all duration-75 px-3 py-1 rounded-full",
    };

    return (
        <div
            className={`fixed top-0 left-0 flex justify-center items-center w-full h-[100vh] bg-white dark:bg-black ${
                dark && "dark"
            }`}
        >
            {user ? (
                <div className="flex gap-3">
                    <button className={className.btn} onClick={newBoard}>
                        Create Board
                    </button>
                    <a className={className.btn} href="/profile">
                        Go To Profile
                    </a>
                </div>
            ) : (
                <button className={className.btn} onClick={login}>
                    Login
                </button>
            )}
        </div>
    );
};

export default NewBoardPage;
