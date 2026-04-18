import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const VOLUNTEERS_COLLECTION = "volunteers";

export async function registerVolunteer(volunteerData) {
  try {
    const volunteerToSave = {
      ...volunteerData,
      campsDone: volunteerData.campsDone || 0,
      registeredAt: serverTimestamp(),
    };
    const docRef = await addDoc(
      collection(db, VOLUNTEERS_COLLECTION),
      volunteerToSave
    );
    console.log("Volunteer registered with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error registering volunteer:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllVolunteers() {
  try {
    const q = query(
      collection(db, VOLUNTEERS_COLLECTION),
      orderBy("registeredAt", "desc")
    );
    const snapshot = await getDocs(q);
    const volunteers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return volunteers;
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return [];
  }
}