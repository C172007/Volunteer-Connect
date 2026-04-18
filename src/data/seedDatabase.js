import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { seedNeeds } from "./seedNeeds";
import { seedVolunteers } from "./seedVolunteers";

export async function seedDatabase() {
  console.log("Starting to seed database...");

  let needsCount = 0;
  for (const need of seedNeeds) {
    await addDoc(collection(db, "needs"), {
      ...need,
      createdAt: serverTimestamp(),
    });
    needsCount++;
    console.log(`Saved need ${needsCount}: ${need.summary}`);
  }

  let volCount = 0;
  for (const volunteer of seedVolunteers) {
    await addDoc(collection(db, "volunteers"), {
      ...volunteer,
      registeredAt: serverTimestamp(),
    });
    volCount++;
    console.log(`Saved volunteer ${volCount}: ${volunteer.name}`);
  }

  console.log(`Done! Seeded ${needsCount} needs and ${volCount} volunteers.`);
  alert(`Database seeded! ${needsCount} needs + ${volCount} volunteers added.`);
}