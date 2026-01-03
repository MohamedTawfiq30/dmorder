import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";



const ordersRef = collection(db, "orders");

// CREATE ORDER (used by automation later)
export async function createOrder(order) {
  await addDoc(ordersRef, {
    ...order,
    status: "pending",
    createdAt: Date.now(),
  });
}

// GET ORDERS FOR DASHBOARD
export async function getOrdersByUser(userId) {
  const q = query(
    ordersRef,
    where("ownerId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// GET ORDERS FOR USER
export async function getOrdersForUser(uid) {
  const q = query(
    collection(db, "orders"),
    where("ownerId", "==", uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// MARK ORDER COMPLETED
export async function markOrderCompleted(orderId) {
  await updateDoc(doc(db, "orders", orderId), {
    status: "completed",
  });
}
