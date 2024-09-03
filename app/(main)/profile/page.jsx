"use client";
import GridCell from "@/components/GridCell";
import { appContext } from "@/context/AppContext";
import { deleteBoard, getBoardInfo } from "@/firebase/firebase.db";
import Link from "next/link";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineOpenInNew } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import SmallLoader from "@/components/SmallLoader";

export default function ProfilePage() {
    const { user } = useContext(appContext);
    const [boards, setBoards] = useState([]);

    const [deleteLoad, setDeleteLoad] = useState(false);

    const fetchBoards = async () => {
        if (user) {
            const data = await getBoardInfo(user?.uid);
            setBoards(data);
        } else {
            setBoards(null)
        }
    };

    useEffect(() => {
        fetchBoards();
        console.log("user: ", user);
    }, [user]);

    const handleDelete = async (bid) => {
        if(deleteLoad) return;

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
                        <div className="relative shadow-sm transition-all duration-100 ease-in dark:bg-neutral-800 md:dark:hover:bg-neutral-700 bg-indigo-300 md:hover:bg-indigo-100 p-4 rounded-md" key={id}>
                            <h1>{brd.name}</h1>
                            <h3>Codes: {brd.codes}</h3>

                            <div className="absolute bottom-2 right-2 flex gap-1">
                                <button
                                    onClick={() => handleDelete(brd.bid)}
                                    className="text-xl md:hover:bg-indigo-300 md:dark:hover:bg-neutral-800 md:hover:shadow-md active:scale-90 transition-all p-2 rounded-full"
                                >
                                    {deleteLoad == brd.bid ? <SmallLoader/> : <AiOutlineDelete />}
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
                <div className="md:mb-4">
                    <h1 className="text-xl font-bold">{user?.displayName}</h1>
                </div>
            </GridCell>

            <GridCell
                rowStart={4}
                colStart={4}
                colSpan={8}
                rowSpan={8}
                className="flex flex-col h-full overflow-auto md:grid grid-cols-5 auto-rows-[100px] gap-3"
            >
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
