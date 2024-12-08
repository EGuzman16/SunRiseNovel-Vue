import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * @param {string} id 
 * @returns {Promise<{id: string, email: string, displayName: string|null|undefined, bio: string|null|undefined, social: string|null|undefined, photoURL: string|null|undefined}>}
 */
export async function getUserProfileById(id) {
    const userRef = doc(db, `users/${id}`);

    try {
        const userDoc = await getDoc(userRef);

        return {
            id: userDoc.id,
            ...userDoc.data(),
        }
    } catch (error) {
        console.error('[user-profile.js getUserProfileById] Error al consultar el perfil del usuario. ', error);
    }
}

/**
 * 
 * @param {string} id  
 * @param {{}} data  
 * @returns {Promise}
 */
export async function createUserProfile(id, data) {
    const userRef = doc(db, `users/${id}`);

    return setDoc(userRef, {...data});
}

/**
 * 
 * @param {string} id 
 * @param {{displayName: string|null, social: string|null, bio: string|null, photoURL: string|null}} data 
 * @returns {Promise}
 */
export async function updateUserProfile(id, data) {
    const userRef = doc(db, `users/${id}`);

    return updateDoc(userRef, {...data});
}