import { db } from './firebase';
import { addDoc, collection, doc, getDoc, updateDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";

// Función para obtener publicaciones desde Firestore y guardar en LocalStorage
export async function getPosts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        localStorage.setItem('posts', JSON.stringify(posts));
        return posts;
    } catch (error) {
        console.error('Error fetching posts from Firestore:', error);
        // Intentar cargar datos desde LocalStorage si hay un error
        const localData = localStorage.getItem('posts');
        if (localData) {
            return JSON.parse(localData);
        } else {
            throw new Error('No se pueden obtener las publicaciones y no hay datos en LocalStorage.');
        }
    }
}

// Función para obtener una publicación específica desde Firestore
export async function getPost(id) {
    const docSnap = await getDoc(doc(db, 'posts', id));
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error('No se encuentra post!');
    }
}

// Función para crear una nueva publicación en Firestore y actualizar LocalStorage
export async function createPost(post) {
    const docRef = await addDoc(collection(db, 'posts'), post);
    const newPost = { id: docRef.id, ...post };
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    return docRef.id;
}

// Función para actualizar una publicación en Firestore y LocalStorage
export async function updatePost(id, updatedPost) {
    await updateDoc(doc(db, 'posts', id), updatedPost);
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
        posts[index] = { id, ...updatedPost };
        localStorage.setItem('posts', JSON.stringify(posts));
    }
}

// Función para eliminar una publicación en Firestore y LocalStorage
export async function deletePost(id) {
    await deleteDoc(doc(db, 'posts', id));
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const updatedPosts = posts.filter(post => post.id !== id);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
}

// Función para obtener comentarios de una publicación específica desde Firestore
export async function getComments(postId) {
    const commentsCollection = collection(db, 'comments');
    const q = query(commentsCollection, where('postId', '==', postId));
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return comments;
}

// Función para agregar un comentario a una publicación en Firestore
export async function addComment(postId, comment) {
    const commentsCollection = collection(db, 'comments');
    const docRef = await addDoc(commentsCollection, { postId, ...comment });
    return docRef.id;
}