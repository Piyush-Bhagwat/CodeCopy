"use client";
import GridCell from "@/components/GridCell";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { FiCopy, FiEdit2, FiPlus, FiSave, FiShare } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { appContext } from "@/context/AppContext";
import {
    addCode,
    getBoard,
    getUserName,
    updateBoardTitle,
    updateCodes,
} from "@/firebase/firebase.db";
import EditModel from "@/components/EditModel";
import { AiOutlineDelete, AiOutlineReload } from "react-icons/ai";
import SmallLoader from "@/components/SmallLoader";

export default function BoardPage({ params }) {
    const className = {
        btn: "dark:hover:bg-neutral-800 hover:bg-indigo-100 dark:hover:shadow-md active:scale-95 transition-all duration-75 px-3 py-1 rounded-full",
        sideEle:
            "dark:bg-neutral-800 bg-indigo-100 px-2 py-1 rounded-md outline-2 w-10/12 active:scale-95 transition-all duration-75 dark:outline-neutral-600 outline-indigo-400 hover:outline focus-visible:outline-none focus-visible:ring-transparent",
        controlBtn:
            "dark:text-white text-2xl transition-all duration-75 outline-dashed outline-2 dark:outline-neutral-600 outline-indigo-400 p-3 dark:hover:bg-neutral-800 hover:bg-indigo-100 active:scale-95 ml-3 rounded-lg",
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

    //loader Variables
    const [saveLoading, setSaveLoading] = useState(false);
    const [addCodeLoading, setAddCodeLoding] = useState(false);
    const [deleteLoad, setDeleteLoad] = useState(false);

    //fetchers
    const fetchBoard = async () => {
        const fetchedBoard = await getBoard(params.bid);
        if (!fetchedBoard) return;

        const boardUserName = await getUserName(fetchedBoard?.uid);
        setCodes(fetchedBoard?.codes);
        setBoardTitle(fetchedBoard?.name);
        setBoard({ ...fetchedBoard, userName: boardUserName });
    };

    //UseEffects

    useEffect(() => {
        fetchBoard();
    }, []);

    useEffect(() => {
        setCode(codes[activeCodeIdx]?.code);
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

    const handleSave = async () => {
        setIsEditing(false);
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

    //renderers

    const renderCodeCards = () => {
        return (
            <>
                {codes?.map((code, id) => {
                    return (
                        <div className="flex items-center mb-2 gap-2">
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
                            {activeCodeIdx == id && (
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

                    {user?.uid == board?.uid && (
                        <button
                            onClick={() =>
                                !saveLoading && setBoardTitleEdit(true)
                            }
                            className="absolute top-0 right-6 p-2 dark:hover:bg-neutral-700 hover:bg-indigo-300 active:scale-90 rounded-full"
                        >
                            {saveLoading ? <SmallLoader /> : <FiEdit2 />}
                        </button>
                    )}
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

                {renderCodeCards()}

                {user?.uid == board?.uid && board && (
                    <button
                        className={`${className.sideEle} flex justify-center items-center gap-2`}
                        onClick={handleAddCode}
                    >
                        Add Code {addCodeLoading ? <SmallLoader /> : <FiPlus />}
                    </button>
                )}
            </GridCell>

            <GridCell
                rowStart={4}
                colStart={4}
                colSpan={8}
                rowSpan={8}
                className="relative"
            >
                <select
                    onChange={(e) => {
                        setMode(e.target.value);
                        console.log(e.target.value);
                    }}
                    value={mode}
                    className="absolute top-3 right-3 z-20 rounded-md outline-dashed outline-2 px-3 py-1 outline-indigo-400 dark:outline-neutral-600 dark:bg-neutral-900"
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
                    {user?.uid == board?.uid &&
                        board &&
                        (isEditing ? (
                            <button
                                className={`${className.controlBtn} bg-indigo-200 dark:bg-neutral-700 animate-pulse`}
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Save"
                                data-tooltip-place="bottom"
                                onClick={handleSave}
                            >
                                <FiSave />
                            </button>
                        ) : (
                            <button
                                className={className.controlBtn}
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Edit"
                                data-tooltip-place="bottom"
                                onClick={() => {
                                    !saveLoading && setIsEditing(true);
                                }}
                            >
                                {saveLoading ? <SmallLoader /> : <FiEdit2 />}
                            </button>
                        ))}
                </div>
            </GridCell>

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
