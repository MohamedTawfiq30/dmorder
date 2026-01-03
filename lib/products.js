import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { auth } from "./firebase";

// 🔹 Add Product
export async function addProduct(data) {
  if (!auth.currentUser) throw new Error("Not authenticated");

  await addDoc(collection(db, "products"), {
    ownerId: auth.currentUser.uid,

    productId: data.productId,
    name: data.name,
    price: data.price,
    sizes: data.sizes,
    colors: data.colors || [],

    createdAt: Date.now(),
  });
}

// 🔹 Get All Products
export async function getProducts() {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "products"),
    where("ownerId", "==", auth.currentUser.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// 🔹 Get Single Product
export async function getProductById(productDocId) {
  const ref = doc(db, "products", productDocId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
}

// 🔹 Update Product
export async function updateProduct(productDocId, data) {
  const ref = doc(db, "products", productDocId);

  await updateDoc(ref, {
    ...data,
    updatedAt: Date.now(),
  });
}

// 🔹 Delete Product
export async function deleteProduct(productDocId) {
  await deleteDoc(doc(db, "products", productDocId));
}
