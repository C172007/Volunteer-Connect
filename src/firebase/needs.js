import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const NEEDS_COLLECTION = "needs";

export async function submitNeed(needData) {
  try {
    const needToSave = {
      ...needData,
      status: "open",
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, NEEDS_COLLECTION), needToSave);
    console.log("Need saved with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving need:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllNeeds() {
  try {
    const q = query(
      collection(db, NEEDS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const needs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return needs;
  } catch (error) {
    console.error("Error fetching needs:", error);
    return [];
  }
}

export function listenToNeeds(callback) {
  const q = query(
    collection(db, NEEDS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const needs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(needs);
  });
  return unsubscribe;
}