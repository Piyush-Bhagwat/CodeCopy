"use client";
import { loginWithGoogle } from "@/firebase/firebase.auth";
import { createNewBoard, getUser } from "@/firebase/firebase.db";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

export const appContext = createContext(null);

const AppContext = ({ children }) => {
    const [dark, setDark] = useState("null");
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    const fetchUser = async (uid) => {
        setUserLoading(true);
        const data = await getUser(uid);
        setUserLoading(false);
        setUser(data);
    };
    
    useEffect(() => {
        if (dark !== "null") {
            localStorage.setItem("theme", JSON.stringify(dark));
        }
    }, [dark]);
    
    useEffect(() => {
        const lsUser = JSON.parse(localStorage.getItem("user"));
        const theme = JSON.parse(localStorage.getItem("theme"));
        setDark(theme);
        if (lsUser) {
            fetchUser(lsUser.uid);
        } else {
            setUserLoading(false);
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
        userLoading,
        isEditing,
    };
    return <appContext.Provider value={val}>{children}</appContext.Provider>;
};

export default AppContext;
