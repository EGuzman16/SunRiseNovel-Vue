import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const cachedChats = {};

export async function sendPrivateChatMessage({senderId, receiverId, content}) {
    const chatId = generatePrivateChatId(senderId, receiverId);
    
    await verifyOrCreatePrivateChatDocument(senderId, receiverId);
    const messagesRef = collection(db, `private-chats/${chatId}/messages`);

    await addDoc(messagesRef, {
        sender_id: senderId,
        content,
        created_at: serverTimestamp(),
    });
}

export function subscribeToPrivateChat(senderId, receiverId, callback) {
    const chatId = generatePrivateChatId(senderId, receiverId);
    const messagesRef = collection(db, `private-chats/${chatId}/messages`);

    const q = query(
        messagesRef,
        orderBy('created_at'),
    );

    return onSnapshot(q, snapshot => {
        const messages = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                sender_id: doc.data().sender_id,
                content: doc.data().content,
                created_at: doc.data().created_at?.toDate(),
            }
        });

        callback(messages);
    });
}

/**
 * Verifica si existe el documento del chat privado y si no existe lo crea.
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<string>}
 */
async function verifyOrCreatePrivateChatDocument(senderId, receiverId) {
    const chatId = generatePrivateChatId(senderId, receiverId);

    if(cachedChats[chatId]) return chatId;

    const chatRef = doc(db, `private-chats/${chatId}`);

    const chatDoc = await getDoc(chatRef);

    if(!chatDoc.exists()) {
        await setDoc(chatRef, {
            users: {
                [senderId]: true,
                [receiverId]: true,
            }
        });
    }

    cachedChats[chatId] = true;

    return chatId;
}

/**
 * Genera el ID chat PVD a partir os ids de los usuarios que hablan entre ellos.
 * 
 * @param {string} id1 
 * @param {string} id2 
 * @returns {string}
 */
function generatePrivateChatId(id1, id2) {
    return [id1, id2].sort().join('_');
}