"use client";
import { loginWithGoogle } from "@/firebase/firebase.auth";
import { createNewBoard, getUser } from "@/firebase/firebase.db";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

export const appContext = createContext(null);

const AppContext = ({ children }) => {
    const [dark, setDark] = useState(true);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    const fetchUser = async (uid) => {
        const data = await getUser(uid);
        setUser(data);
    };

    useEffect(() => {
        const lsUser = JSON.parse(localStorage.getItem("user"));
        if (lsUser) {
            fetchUser(lsUser.uid);
        }
    }, []);

    const login = async () => {
        const data = await loginWithGoogle();
        console.log(data);

        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
    };

    const newBoard = async (name) => {
        const board = await createNewBoard(user.uid, name);
        router.push(`/board/${board.bid}`);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        router.push("/board");
    };

    const val = {
        dark,
        setDark,
        user,
        login,
        newBoard,
        logout,
        setIsEditing,
        isEditing,
    };
    return <appContext.Provider value={val}>{children}</appContext.Provider>;
};

export default AppContext;
