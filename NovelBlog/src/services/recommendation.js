import { db } from './firebase';
import { addDoc, collection, doc, getDoc, updateDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";

// Función para obtener recomendaciones desde Firestore y guardar en LocalStorage
export async function getRecommendations() {
    try {
        const querySnapshot = await getDocs(collection(db, 'recommendations'));
        const recommendations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        localStorage.setItem('recommendations', JSON.stringify(recommendations));
        return recommendations;
    } catch (error) {
        console.error('Error fetching recommendations from Firestore:', error);
        // Intentar cargar datos desde LocalStorage si hay un error
        const localData = localStorage.getItem('recommendations');
        if (localData) {
            return JSON.parse(localData);
        } else {
            throw new Error('No se pueden obtener las recomendaciones y no hay datos en LocalStorage.');
        }
    }
}

// Función para obtener una recomendación específica desde Firestore
export async function getRecommendation(id) {
    const docSnap = await getDoc(doc(db, 'recommendations', id));
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error('No se encuentra la recomendación!');
    }
}

// Función para crear una nueva recomendación en Firestore y actualizar LocalStorage
export async function createRecommendation(recommendation) {
    const docRef = await addDoc(collection(db, 'recommendations'), recommendation);
    const newRecommendation = { id: docRef.id, ...recommendation };
    const recommendations = JSON.parse(localStorage.getItem('recommendations')) || [];
    recommendations.push(newRecommendation);
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
    return docRef.id;
}

// Función para actualizar una recomendación en Firestore y LocalStorage
export async function updateRecommendation(id, updatedRecommendation) {
    await updateDoc(doc(db, 'recommendations', id), updatedRecommendation);
    const recommendations = JSON.parse(localStorage.getItem('recommendations')) || [];
    const index = recommendations.findIndex(rec => rec.id === id);
    if (index !== -1) {
        recommendations[index] = { id, ...updatedRecommendation };
        localStorage.setItem('recommendations', JSON.stringify(recommendations));
    }
}

// Función para eliminar una recomendación en Firestore y LocalStorage
export async function deleteRecommendation(id) {
    await deleteDoc(doc(db, 'recommendations', id));
    const recommendations = JSON.parse(localStorage.getItem('recommendations')) || [];
    const updatedRecommendations = recommendations.filter(rec => rec.id !== id);
    localStorage.setItem('recommendations', JSON.stringify(updatedRecommendations));
}

// Función para obtener comentarios de una recomendación específica desde Firestore
export async function getComments(recommendationId) {
    const commentsCollection = collection(db, 'comments');
    const q = query(commentsCollection, where('recommendationId', '==', recommendationId));
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return comments;
}

// Función para agregar un comentario a una recomendación en Firestore
export async function addComment(recommendationId, comment) {
    const commentsCollection = collection(db, 'comments');
    const docRef = await addDoc(commentsCollection, { recommendationId, ...comment });
    return docRef.id;
}