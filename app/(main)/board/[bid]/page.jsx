"use client";
import GridCell from "@/components/GridCell";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import {
    FiCopy,
    FiEdit2,
    FiLock,
    FiMenu,
    FiPlus,
    FiSave,
    FiShare,
    FiUnlock,
    FiX,
} from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { appContext } from "@/context/AppContext";
import {
    addCode,
    getBoard,
    getBoardVisiblity,
    getUserName,
    updateBoardTitle,
    updateBoardVisibility,
    updateCodes,
} from "@/firebase/firebase.db";
import EditModel from "@/components/EditModel";
import { AiOutlineDelete, AiOutlineReload } from "react-icons/ai";
import SmallLoader from "@/components/SmallLoader";
import Link from "next/link";

export default function BoardPage({ params }) {
    const className = {
        btn: "md:dark:hover:bg-neutral-800 md:hover:bg-indigo-100 md:dark:hover:shadow-md active:scale-95 transition-all duration-75 px-3 py-1 rounded-full",
        sideEle:
            "dark:bg-neutral-800 bg-indigo-100 px-2 py-1 rounded-md outline-2 w-10/12 active:scale-95 transition-all duration-75 dark:outline-neutral-600 outline-indigo-400 md:hover:outline focus-visible:outline-none focus-visible:ring-transparent",
        controlBtn:
            "dark:text-white text-2xl transition-all duration-75 outline-dashed outline-2 dark:outline-neutral-600 outline-indigo-400 p-2 md:p-3 md:dark:hover:bg-neutral-800 md:hover:bg-indigo-100 active:scale-95 ml-3 rounded-lg",
        extraClasses: "dark:bg-neutral-600",
    };

    const { dark, user, isEditing, setIsEditing } = useContext(appContext);
    const [code, setCode] = useState("");

    const [codes, setCodes] = useState([]);
    const [activeCodeIdx, setActiveCodeIdx] = useState(0);

    const [mode, setMode] = useState("javascript");
    const [board, setBoard] = useState(null);
    const [curCodeName, setCurCodeName] = useState("");
    const [boardTitleEdit, setBoardTitleEdit] = useState(false);
    const [boardTitle, setBoardTitle] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [boardVisiblity, setBoardVisiblity] = useState(false);
    const [fetchable, setFetchable] = useState(false);
    const [oldCode, setOldCode] = useState("");

    //loader Variables
    const [boardLoading, setBoardLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [addCodeLoading, setAddCodeLoding] = useState(false);
    const [visiblityLoading, setVisiblityLoading] = useState(false);

    //fetchers
    const fetchBoard = async () => {
        const fetchedBoard = await getBoard(params.bid);
        if (!fetchedBoard) return;
        const boardUserName = await getUserName(fetchedBoard?.uid);
        setCodes(fetchedBoard?.codes);
        setBoardVisiblity(await getBoardVisiblity(params.bid));
        setBoardTitle(fetchedBoard?.name);
        setBoard({ ...fetchedBoard, userName: boardUserName });
    };

    const fetchBoardVisiblity = async () => {
        setBoardLoading(true);
        const fetchedVisiblity = await getBoardVisiblity(params.bid);
        if (fetchedVisiblity) {
            const uid = fetchedVisiblity.uid;
            const visiblity = fetchedVisiblity.visibility;
            // setBoardVisiblity(fetchBoardVisiblity);

            if (visiblity || user?.uid == uid) {
                console.log("fetchable");
                setFetchable(true);
                await fetchBoard();
            } else {
                setFetchable(false);
            }
        } else {
            setFetchable("not-found");
        }
        setBoardLoading(false);
    };

    //UseEffects
    useEffect(() => {
        fetchBoardVisiblity();
    }, [user]);

    useEffect(() => {
        setCode(codes[activeCodeIdx]?.code);
        setOldCode(codes[activeCodeIdx]?.code);
        setMode(codes[activeCodeIdx]?.language);
        setCurCodeName(codes[activeCodeIdx]?.name);
        console.log(activeCodeIdx);
    }, [activeCodeIdx, board]);

    useEffect(() => {
        async function update() {
            setSaveLoading(true);
            await updateCodes(board?.bid, codes);
            setSaveLoading(false);
        }

        if (codes && board && user) {
            update();
        }
    }, [codes]);

    //handlers

    const handleAddCode = async () => {
        if (addCodeLoading) return;

        setAddCodeLoding(true);
        await addCode(board?.bid);
        setAddCodeLoding(false);

        setCodes((p) => [
            ...p,
            {
                name: `Code-${codes?.length + 1}`,
                code: "",
                time: Date.now(),
                language: "javascript",
                copies: 0,
            },
        ]);
    };

    const handleMakePublic = async () => {
        if (board && user?.uid == board?.uid) {
            setVisiblityLoading(true);
            await updateBoardVisibility(board?.bid, true);
            setVisiblityLoading(false);
            setBoardVisiblity(true);
        }
    };

    const handleMakePrivate = async () => {
        if (board && user?.uid == board?.uid) {
            setVisiblityLoading(true);
            await updateBoardVisibility(board?.bid, false);
            setVisiblityLoading(false);
            setBoardVisiblity(false);
        }
    };

    const handleSave = async () => {
        setIsEditing(false);
        setOldCode(code);
        setCodes((p) => {
            return p?.map((cod, id) => {
                if (id == activeCodeIdx) {
                    console.log("match", id);

                    return {
                        name: curCodeName,
                        code,
                        time: cod.time,
                        language: mode,
                        copies: cod.copies,
                    };
                }

                return cod;
            });
        });
    };

    const handleDelete = async (id) => {
        const newCodes = [...codes];
        newCodes.splice(id, 1);

        setCodes(newCodes);
    };

    const handleCodeEditCancle = () => {
        setCode(oldCode);
        setIsEditing(false);
    };

    //renderers
    const renderCodeCards = () => {
        return (
            <>
                {codes?.map((code, id) => {
                    return (
                        <div className="flex items-center mb-2 gap-2" key={id}>
                            <input
                                key={id}
                                type="text"
                                onClick={() => {
                                    setActiveCodeIdx(id);
                                }}
                                onChange={(e) => setCurCodeName(e.target.value)}
                                className={`${
                                    activeCodeIdx == id &&
                                    "dark:bg-zinc-700 bg-indigo-300"
                                } ${
                                    isEditing &&
                                    activeCodeIdx == id &&
                                    "border-2 border-dashed dark:border-neutral-400 border-neutral-800"
                                } ${className.sideEle}`}
                                value={
                                    isEditing && activeCodeIdx == id
                                        ? curCodeName
                                        : code.name
                                }
                                readOnly={!isEditing && activeCodeIdx == id}
                                maxLength={16}
                            />
                            {activeCodeIdx == id && board?.uid === user?.uid && (
                                <button
                                    className="text-xl hover:bg-indigo-300 dark:hover:bg-neutral-800 hover:shadow-md active:scale-90 transition-all p-2 rounded-full"
                                    onClick={() => handleDelete(id)}
                                >
                                    {saveLoading ? (
                                        <SmallLoader />
                                    ) : (
                                        <AiOutlineDelete />
                                    )}
                                </button>
                            )}
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
                className="rounded-l-none pl-4 overflow-auto relative"
            >
                <div className="mb-4 relative">
                    <h1 className="text-xl font-bold">{boardTitle}</h1>
                    <p className="text-xs font-thin">
                        (By {board?.userName.split(" ")[0]})
                    </p>
                    <div>
                        {user?.uid == board?.uid && user && (
                            <div className="flex gap-2 absolute top-0 right-0 ">
                                {user?.uid == board?.uid && (
                                    <button
                                        onClick={() =>
                                            !saveLoading &&
                                            setBoardTitleEdit(true)
                                        }
                                        className="p-2 dark:hover:bg-neutral-700 hover:bg-indigo-300 active:scale-90 rounded-full"
                                    >
                                        {saveLoading ? (
                                            <SmallLoader />
                                        ) : (
                                            <FiEdit2 />
                                        )}
                                    </button>
                                )}
                                {!boardVisiblity ? (
                                    <button
                                        className={
                                            "p-2 md:dark:hover:bg-neutral-700 md:hover:bg-indigo-300 active:scale-90 rounded-full"
                                        }
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content="Make Public"
                                        data-tooltip-place="bottom"
                                        onClick={handleMakePublic}
                                    >
                                        {visiblityLoading || boardLoading ? (
                                            <SmallLoader />
                                        ) : (
                                            <FiLock />
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        className={
                                            "p-2 md:dark:hover:bg-neutral-700 md:hover:bg-indigo-300 active:scale-90 rounded-full"
                                        }
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content="Make Private"
                                        data-tooltip-place="bottom"
                                        onClick={handleMakePrivate}
                                    >
                                        {visiblityLoading || boardLoading ? (
                                            <SmallLoader />
                                        ) : (
                                            <FiUnlock />
                                        )}
                                    </button>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => setMenuOpen((m) => !m)}
                            className="md:hidden p-2 flex gap-2 md:dark:hover:bg-neutral-700 md:hover:bg-indigo-300 active:scale-90 rounded-full"
                        >
                            <FiMenu />
                        </button>
                    </div>

                    {boardTitleEdit && (
                        <EditModel
                            value={boardTitle}
                            setValue={setBoardTitle}
                            onSave={async () => {
                                setSaveLoading(true);
                                await updateBoardTitle(board?.bid, boardTitle);
                                setSaveLoading(false);
                            }}
                            title="Set Board Name"
                            setVisiblity={setBoardTitleEdit}
                            max={14}
                        />
                    )}
                </div>

                <div
                    className={`${
                        menuOpen ? "max-h-32" : "h-0 hidden"
                    } md:visible md:block transition-all md:h-fit `}
                >
                    {renderCodeCards()}

                    {user?.uid == board?.uid && board && (
                        <button
                            className={`${className.sideEle} flex justify-center items-center gap-2`}
                            onClick={handleAddCode}
                        >
                            Add Code{" "}
                            {addCodeLoading ? <SmallLoader /> : <FiPlus />}
                        </button>
                    )}
                </div>
            </GridCell>

            {boardLoading ? (
                <GridCell
                    rowStart={4}
                    colStart={4}
                    colSpan={8}
                    rowSpan={8}
                    className="relative h-full"
                >
                    <div className="flex gap-2 items-center ml-3">
                        <SmallLoader />
                        <p>Loading...</p>
                    </div>
                </GridCell>
            ) : fetchable ? (
                <GridCell
                    rowStart={4}
                    colStart={4}
                    colSpan={8}
                    rowSpan={8}
                    className="relative h-full"
                >
                    <select
                        onChange={(e) => {
                            setMode(e.target.value);
                            console.log(e.target.value);
                        }}
                        value={mode}
                        className="absolute top-3 right-3 z-20 rounded-md outline-dashed outline-2 md:px-3 md:py-1 p-1 outline-indigo-400 dark:outline-neutral-600 dark:bg-neutral-900"
                        disabled={!isEditing}
                    >
                        <option value="javascript">javascript</option>
                        <option value="java">java</option>
                        <option value="csharp">C#</option>
                        <option value="python">Python</option>
                        <option value="ruby">Ruby</option>
                        <option value="json">JSON</option>
                        <option value="html">HTML</option>
                    </select>
                    <AceEditor
                        height="100%"
                        width="100%"
                        value={code}
                        onChange={(e) => setCode(e)}
                        mode={mode}
                        readOnly={!isEditing}
                        theme={`${dark ? "terminal" : "textmate"}`}
                        fontSize="18px"
                        showPrintMargin={false}
                        showGutter={false}
                        focus={false}
                        placeholder="Paste or Type code"
                        highlightActiveLine={true}
                        setOptions={{
                            enableLiveAutocompletion: true,
                            showLineNumbers: true,
                            tabSize: 2,
                        }}
                        className="rounded-md p-3"
                    />

                    <div className="absolute bottom-8 right-5">
                        <button
                            className={className.controlBtn}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Copy"
                            data-tooltip-place="bottom"
                            onClick={() => navigator.clipboard.writeText(code)}
                        >
                            <FiCopy />
                        </button>
                        <button
                            className={className.controlBtn}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Share"
                            data-tooltip-place="bottom"
                            onClick={() =>
                                board &&
                                navigator.clipboard.writeText(
                                    `https://code-copy-dusky.vercel.app/board/${board?.bid}`
                                )
                            }
                        >
                            <FiShare />
                        </button>
                        <span className="text-2xl ml-3 relative">
                            <button
                                className={`absolute ${
                                    isEditing ? "bottom-16" : "bottom-0 scale-0"
                                } transition-all duration-100 right-1/2 translate-x-1/2 hover:shadow-md ease-in-out text-neutral-900 hover:bg-indigo-200 dark:text-white rounded-full p-1 dark:hover:bg-neutral-700`}
                                onClick={handleCodeEditCancle}
                            >
                                <FiX />
                            </button>

                            {user?.uid == board?.uid &&
                                board &&
                                (isEditing ? (
                                    <button
                                        className="dark:text-white text-2xl transition-all duration-75 outline-dashed outline-2 dark:outline-neutral-600 outline-indigo-400 p-2 md:p-3 md:dark:hover:bg-neutral-800 md:hover:bg-indigo-100 active:scale-95 rounded-lg bg-indigo-200 dark:bg-neutral-700 animate-pulse"
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content="Save"
                                        data-tooltip-place="bottom"
                                        onClick={handleSave}
                                    >
                                        <FiSave />
                                    </button>
                                ) : (
                                    <button
                                        className="dark:text-white text-2xl transition-all duration-75 outline-dashed outline-2 dark:outline-neutral-600 outline-indigo-400 p-2 md:p-3 md:dark:hover:bg-neutral-800 md:hover:bg-indigo-100 active:scale-95 rounded-lg"
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content="Edit"
                                        data-tooltip-place="bottom"
                                        onClick={() => {
                                            !saveLoading && setIsEditing(true);
                                        }}
                                    >
                                        {saveLoading ? (
                                            <SmallLoader />
                                        ) : (
                                            <FiEdit2 />
                                        )}
                                    </button>
                                ))}
                        </span>
                    </div>
                </GridCell>
            ) : (
                <GridCell
                    rowStart={4}
                    colStart={4}
                    colSpan={8}
                    rowSpan={8}
                    className="relative h-full"
                >
                    <FiLock className="text-indigo-300/60 dark:text-neutral-800/50 animate-pulse text-[17em] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
                    <div className="flex relative justify-center items-center w-full h-full flex-col z-20 gap-3">
                        <p className="text-lg">
                            Opps... this is a private board
                        </p>
                        {user ? (
                            <Link
                                href={"/profile"}
                                className={`rounded-full active:scale-95 hover:bg-indigo-400 dark:hover:bg-neutral-400 px-3 py-1 bg-indigo-500 dark:bg-neutral-300 text-white dark:text-black transition-all duration-75`}
                            >
                                Go To Profile
                            </Link>
                        ) : (
                            <Link
                                href={"/"}
                                className={`rounded-full active:scale-95 hover:bg-indigo-400 dark:hover:bg-neutral-400 px-3 py-1 bg-indigo-500 dark:bg-neutral-300 text-white dark:text-black transition-all duration-75`}
                            >
                                Home
                            </Link>
                        )}
                    </div>
                </GridCell>
            )}

            <div className="dark:text-white fixed bottom-5 left-2 text-sm">
                Created By{" "}
                <a className="text-blue-600" href="#">
                    abNormal
                </a>
            </div>

            <Tooltip id="my-tooltip" />
        </>
    );
}
