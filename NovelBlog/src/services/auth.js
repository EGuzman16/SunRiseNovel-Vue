import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, getUserProfileById, updateUserProfile } from "./user-profile";

const AUTH_EMPTY_STATE = {
    id: null,
    email: null,
    displayName: null,
    bio: null,
    social: null,
    avatarUrl: null, 
    fullProfileLoaded: false,
};

let authUser = AUTH_EMPTY_STATE;

// Lista de "observers".
let observers = [];
if(localStorage.getItem('user')) {
    authUser = JSON.parse(localStorage.getItem('user'));
}

onAuthStateChanged(auth, async user => {
    if(user) {
        updateUserData({
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
        });

        const profileData = await getUserProfileById(authUser.id);

        updateUserData({
            ...profileData,
            fullProfileLoaded: true,
        });

    } else {
        updateUserData(AUTH_EMPTY_STATE);
        localStorage.removeItem('user');
    }
});

/**
 * Crea un usuario y lo autentifica.
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {string} role
 * @param {string} avatarUrl
 * @returns {Promise<{id: string, email: string}>}
 */
export async function register(email, password, role, avatarUrl) {
    try {  
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        await createUserProfile(userCredentials.user.uid, { email, role, avatarUrl });

        console.log('Usuario creado: ', userCredentials);
        return {
            id: userCredentials.user.uid,
            email: userCredentials.user.email,
        };
    } catch (error) {
        console.error('[auth.js register] Error al crear el usuario: ', error);
    }
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{id: string, email: string}>}
 */
export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then(user => {
            return {
                id: user.uid,
                email: user.email,
            }
        });
}

/**
 * 
 * @param {{displayName: string|null, bio: string|null, social: string|null, avatarUrl: string|null}} data
 * @returns {Promise<void>}
 */
export async function updateUser({displayName , bio, social, avatarUrl}) {
    try {
        const authPromise = updateProfile(auth.currentUser, {displayName, photoURL: avatarUrl});
        const storePromise = updateUserProfile(authUser.id, {
            displayName,
            bio,
            social,
            avatarUrl,
        });

        await Promise.all([authPromise, storePromise]);

        updateUserData({
            displayName,
            bio,
            social,
            avatarUrl,
        });
    } catch (error) {
        console.error('[auth.js updateProfile] Error al actualizar el perfil: ', error);
        throw error;
    }
}

/**
 * @returns {Promise<void>}
 */
export function logout() {
    return signOut(auth);
}

/**
 * Agrega un observer para la autenticación, y lo ejecuta.
 * 
 * @param {(user) => void} callback 
 * @returns {() => void} 
 */
export function subscribeToAuth(callback) {
    observers.push(callback);
    notify(callback);

    return () => observers = observers.filter(obs => obs !== callback);
}

/**
 * Ejecuta el observer.
 * 
 * @param {(user) => void} observer 
 */
function notify(observer) {
    observer({...authUser});
}

/**
 * Notifica a todos los observers.
 */
function notifyAll() {
    observers.forEach(obs => notify(obs));
}

/**
 * Actualiza los datos.
 * 
 * @param {{id: string|null, email: string|null, displayName: string|null, bio: string|null, social: string|null, avatarUrl: string|null}} data 
 */
function updateUserData(data) {
    authUser = {
        ...authUser,
        ...data,
    }
    localStorage.setItem('user', JSON.stringify(authUser));
    notifyAll();
}