import { addUser, getUser } from "./firebase.db";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase.config";

const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const data = (await signInWithPopup(auth, provider)).user;
    if (data) {
        const usr = await getUser(data.uid);
        console.log("User fetched", usr);
        

        if (usr) {
            return usr;
        } else {
            const usrData = {
                email: data.email,
                uid: data.uid,
                displayName: data.displayName,
                photoURL: data.photoURL,
                date: Date.now(),
            };
            await addUser(usrData);

            return usrData;
        }
    } else {
        return null;
    }
};

export { loginWithGoogle };
