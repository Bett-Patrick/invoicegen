import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  getDoc,
  collection,
  where,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { updateDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBor318JIjOTUZ78dLtVfRWkLsEf7z1ILc",
  authDomain: "invoicegen-73d01.firebaseapp.com",
  projectId: "invoicegen-73d01",
  storageBucket: "invoicegen-73d01.appspot.com",
  messagingSenderId: "457258145230",
  appId: "1:457258145230:web:6d0aeceeaa1bc9490b879f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert((err as Error).message);
  }
};
const logInWithEmailAndPassword = async (email:string, password:string) => {
  try {
    await signInWithEmailAndPassword( auth, email, password);
  } catch (err) {
    console.error(err);
    alert((err as Error).message);
  }
};
const registerWithEmailAndPassword = async (name:string, email:string,companyName:string, password:string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      name,
      companyName,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert((err as Error).message);
  }
};
const saveInvoice = async (invoiceData: any) => {
  try {
    const docRef = await addDoc(collection(db, "invoices"), invoiceData);
    return docRef.id;
  } catch (err) {
    console.error("Error saving invoice:", err);
    throw err;
  }
};
const updateInvoiceStatus = async (invoiceId: string, status: string) => {
  try {
    const invoiceRef = doc(db, "invoices", invoiceId);
    await updateDoc(invoiceRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("Error updating invoice status:", err);
    throw err;
  }
};
const updateInvoicePartial = async (invoiceId: string, amount: number) => {
  try {
    const invoiceRef = doc(db, "invoices", invoiceId);
    await updateDoc(invoiceRef, {
      status: "Partially Paid",
      partialPaidAmount: amount,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("Error updating invoice partial payment:", err);
    throw err;
  }
};
const getInvoicesByUser = async (uid: string) => {
  try {
    const invoicesQuery = query(collection(db, "invoices"), where("uid", "==", uid));
    const invoicesSnapshot = await getDocs(invoicesQuery);
    return invoicesSnapshot.docs.map((doc) => {
      const data = doc.data() as any;
      const createdAt = data.createdAt;
      const createdAtString =
        createdAt && typeof createdAt === "object"
          ? createdAt.toDate
            ? createdAt.toDate().toISOString()
            : "seconds" in createdAt
            ? new Date(createdAt.seconds * 1000).toISOString()
            : String(createdAt)
          : typeof createdAt === "string"
          ? createdAt
          : undefined;

      return {
        id: doc.id,
        ...data,
        createdAt: createdAtString,
      };
    });
  } catch (err) {
    console.error("Error fetching invoices:", err);
    throw err;
  }
};
const sendPasswordReset = async (email:string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert((err as Error).message);
  }
};
const logout = () => {
  signOut(auth);
};
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  saveInvoice,
  updateInvoiceStatus,
  updateInvoicePartial,
  getInvoicesByUser,
  sendPasswordReset,
  logout,
};