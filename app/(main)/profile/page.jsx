"use client";
import GridCell from "@/components/GridCell";
import { appContext } from "@/context/AppContext";
import { deleteBoard, getBoardInfo, updateAbout } from "@/firebase/firebase.db";
import Link from "next/link";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineOpenInNew } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import SmallLoader from "@/components/SmallLoader";
import Image from "next/image";
import { FiEdit, FiEdit2 } from "react-icons/fi";
import EditModel from "@/components/EditModel";

export default function ProfilePage() {
    const { user } = useContext(appContext);
    const [boards, setBoards] = useState([]);

    const [deleteLoad, setDeleteLoad] = useState(false);
    const [boardLoad, setBoardLoad] = useState(true);

    //data
    const [about, setAbout] = useState("");

    //toggles
    const [isAboutEdit, setIsAboutEdit] = useState(false);

    const fetchBoards = async () => {
        setBoardLoad(true);
        if (user) {
            const data = await getBoardInfo(user?.uid);
            setBoards(data);
        } else {
            setBoards(null);
        }
        setBoardLoad(false);
    };

    useEffect(() => {
        fetchBoards();
        setAbout(user?.about);
        console.log("user: ", user);
    }, [user]);

    const handleDelete = async (bid) => {
        if (deleteLoad) return;

        setDeleteLoad(bid);
        await deleteBoard(bid, user.uid);
        setDeleteLoad(false);

        setBoards((p) => {
            return p.filter((i) => i.bid !== bid);
        });
    };

    const renderBoards = () => {
        return (
            <>
                {boards?.map((brd, id) => {
                    return (
                        <div
                            className="relative shadow-sm transition-all duration-100 ease-in dark:bg-neutral-800 md:dark:hover:bg-neutral-700 bg-indigo-300 md:hover:bg-indigo-100 p-4 rounded-md"
                            key={id}
                        >
                            <h1>{brd.name}</h1>
                            <h3>Codes: {brd.codes}</h3>

                            <div className="absolute bottom-2 right-2 flex gap-1">
                                <button
                                    onClick={() => handleDelete(brd.bid)}
                                    className="text-xl md:hover:bg-indigo-300 md:dark:hover:bg-neutral-800 md:hover:shadow-md active:scale-90 transition-all p-2 rounded-full"
                                >
                                    {deleteLoad == brd.bid ? (
                                        <SmallLoader />
                                    ) : (
                                        <AiOutlineDelete />
                                    )}
                                </button>
                                <Link
                                    href={`board/${brd.bid}`}
                                    className="text-xl md:hover:bg-indigo-300 md:dark:hover:bg-neutral-800 md:hover:shadow-md active:scale-90 transition-all p-2 rounded-full"
                                >
                                    <MdOutlineOpenInNew />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <>
            <GridCell
                rowStart={4}
                colStart={1}
                colSpan={2}
                rowSpan={8}
                className="md:rounded-l-none pl-4"
            >
                <div className="md:mb-4 flex items-center justify-center">
                    <h1 className="text-xl font-bold">{user?.displayName}</h1>

                    <Image
                        src={user?.photoURL}
                        width={100}
                        height={100}
                        className="rounded-full shadow-md"
                    />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsAboutEdit(!isAboutEdit)}
                        className="absolute right-4 p-2 dark:hover:bg-neutral-700 hover:bg-indigo-300 active:scale-90 rounded-full"
                    >
                        <FiEdit2 />
                    </button>
                    <h1 className="text-xl font-bold">About: </h1>
                    <p>{about}</p>
                    {isAboutEdit && (
                        <EditModel
                            value={about}
                            setValue={setAbout}
                            onSave={async () => {
                                await updateAbout(user?.uid, about);
                            }}
                            title="Update About"
                            setVisiblity={setIsAboutEdit}
                            max={250}
                            size="lg"
                        />
                    )}
                </div>

                <div>

                </div>
            </GridCell>

            <GridCell
                rowStart={4}
                colStart={4}
                colSpan={8}
                rowSpan={8}
                className={`${
                    boardLoad && "animate-pulse"
                } flex flex-col h-full overflow-auto md:grid grid-cols-5 auto-rows-[100px] gap-3`}
            >
                {boardLoad && <SmallLoader />}
                {renderBoards()}
            </GridCell>

            <div className="dark:text-white fixed bottom-5 left-2 text-sm">
                Created By{" "}
                <a className="text-blue-600" href="#">
                    abNormal
                </a>
            </div>
        </>
    );
}
