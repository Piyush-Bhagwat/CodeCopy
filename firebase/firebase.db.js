import {
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "./firebase.config";
import { makeid } from "@/utils/utils";

const userRef = collection(db, "user");
const boardRef = collection(db, "board");

const getUser = async (uid) => {
    const userDoc = doc(db, "user", uid);
    const data = await getDoc(userDoc);

    return data.data();
};

const getUserName = async (uid) => {
    const userDoc = doc(db, "user", uid);
    const data = await getDoc(userDoc);

    return data.data().displayName;
};

const addUser = async (data) => {
    await setDoc(doc(db, "user", data.uid), data);
    console.log("User created", data.displayName);
};

//Board Functions

const createNewBoard = async (uid, name = "NewBoard") => {
    let bid = makeid(20);
    while (true) {
        if (await isBidAvalible(bid)) {
            break;
        } else bid = makeid(20);
    }

    const emptyBoard = {
        name,
        uid,
        bid,
        codes: [],
    };

    await setDoc(doc(db, "board", bid), emptyBoard);
    await updateDoc(doc(db, "user", uid), { boards: arrayUnion(bid) });
    return emptyBoard;
};

const isBidAvalible = async (bid) => {
    const bord = await getBoard(bid);
    if (bord) return false;
    else return true;
};

const getBoard = async (bid) => {
    const boardDoc = doc(db, "board", bid);

    const snap = await getDoc(boardDoc);

    return snap.data();
};

const addCode = async (bid) => {
    const board = await getBoard(bid);
    const boardDoc = doc(db, "board", bid);

    const emptyCode = {
        name: `Code-${board.codes.length + 1}`,
        code: "",
        time: Date.now(),
        language: "javascript",
        copies: 0,
    };

    updateDoc(boardDoc, {
        codes: arrayUnion(emptyCode),
    });
};

const updateCodes = async (bid, codes) => {
    try {
        if (db) {
            console.log("Code updated");

            const boardDoc = doc(db, "board", bid);
            await updateDoc(boardDoc, { codes });
        }
    } catch (e) {
        console.log(e);
    }
};

const getBoardInfo = async (bids) => {
    const info = [];
    console.log("Bids", bids);

    for (const bid of bids) {
        const board = await getBoard(bid);
        info.push({
            name: board.name,
            bid: board.bid,
            codes: board.codes.length,
        });
    }

    return info;
};

const updateBoardTitle = async (bid, name) => {
    const boardRef = doc(db, "board", bid);

    await updateDoc(boardRef, { name });
};

const deleteBoard = async (bid, uid) => {
    const boardRef = doc(db, "board", bid);
    const userRef = doc(db, "user", uid);

    await deleteDoc(boardRef);
    await updateDoc(userRef, { boards: arrayRemove(bid) });
};

export {
    getUser,
    addUser,
    getBoardInfo,
    deleteBoard,
    addCode,
    getUserName,
    updateBoardTitle,
    getBoard,
    createNewBoard,
    updateCodes,
};
