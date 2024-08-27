"use client";
import GridCell from "@/components/GridCell";
import { FiSave } from "react-icons/fi";
import { useContext, useState } from "react";
import { Tooltip } from "react-tooltip";
import { appContext } from "@/context/AppContext";
import Link from "next/link";
import EditModel from "@/components/EditModel";

const Mainlayout = ({ children }) => {
    const className = {
        btn: "dark:hover:bg-neutral-800 hover:bg-indigo-100 dark:hover:shadow-md active:scale-95 transition-all duration-75 px-3 py-1 rounded-full",
        sideEle:
            "dark:bg-neutral-800 bg-indigo-100 mr-5 px-2 py-1 rounded-md outline-2 w-10/12 active:scale-95 transition-all duration-75 dark:outline-neutral-600 outline-indigo-400 mb-2 hover:outline focus-visible:outline-none focus-visible:ring-transparent",
        controlBtn:
            "dark:text-white text-2xl transition-all duration-75 outline-dashed outline-2 dark:outline-neutral-600 outline-indigo-400 p-3 dark:hover:bg-neutral-800 hover:bg-indigo-100 active:scale-95 ml-3 rounded-lg",
    };

    const { dark, setDark, login, logout, user, newBoard, isEditing } =
        useContext(appContext);

    const [newBoardEdit, setNewBoardEdit] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState("");

    //handlers
    const handleNewBoard = () => {
        if (!user) {
            alert("Please Login");
            return;
        }
        setNewBoardEdit(true);
    };

    return (
        <main
            className={`grid  grid-cols-12 grid-rows-12 gap-2 h-[100vh] dark:bg-black ${
                dark && "dark"
            }`}
        >
            <GridCell
                rowStart={2}
                colSpan={2}
                className="rounded-l-none flex items-center justify-center"
            >
                <h1 className="text-xl font-bold tracking-wider">Copy Code</h1>
            </GridCell>

            <GridCell
                rowStart={2}
                colStart={4}
                colSpan={8}
                className="flex justify-between items-center"
            >
                <div>
                    <button className={className.btn} onClick={handleNewBoard}>
                        newBoard
                    </button>
                    {newBoardEdit && (
                        <EditModel
                            title="New Board Name"
                            value={newBoardTitle}
                            setValue={setNewBoardTitle}
                            setVisiblity={setNewBoardEdit}
                            max={14}
                            onSave={() => newBoard(newBoardTitle)}
                        />
                    )}
                    {user && (
                        <Link className={className.btn} href="/profile">
                            Profile
                        </Link>
                    )}
                    <button
                        className={className.btn}
                        onClick={() => setDark((p) => !p)}
                    >
                        theme
                    </button>
                </div>

                {!user && (
                    <p className="text-neutral-600 text-sm">
                        (Login to create Board {"->"})
                    </p>
                )}

                {isEditing && (
                    <p className="text-neutral-600 text-sm flex items-center">
                        (Dont forget to Save!! <FiSave />)
                    </p>
                )}

                {user ? (
                    <button className={className.btn} onClick={logout}>
                        logout
                    </button>
                ) : (
                    <button className={className.btn} onClick={login}>
                        login
                    </button>
                )}
            </GridCell>

            {children}

            <div className="dark:text-white fixed bottom-5 left-2 text-sm">
                Created By{" "}
                <a className="text-blue-600" href="#">
                    abNormal
                </a>
            </div>

            <Tooltip id="my-tooltip" />
        </main>
    );
};

export default Mainlayout;
