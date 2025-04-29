import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

/**
 * ✅ Save user information (personal data)
 * /users/{uid}
 */
export const saveUserToFirestore = async (
  uid: string,
  email: string,
  nickname: string
) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      nickname,
    });
  } catch (error) {
    console.error('❌ Failed to save user to Firestore:', error);
    throw error;
  }
};

/**
 * ✅ Check for duplicate nickname
 * Verify existence of document /nicknames/{nickname}
 */
export const isNicknameTaken = async (nickname: string): Promise<boolean> => {
  const docRef = doc(db, 'nicknames', nickname);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

/**
 * ✅ Register a nickname
 * Create a document at /nicknames/{nickname} (track owner by uid)
 */
export const registerNickname = async (nickname: string, uid: string) => {
  try {
    await setDoc(doc(db, 'nicknames', nickname), {
      uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('❌ Failed to register nickname:', error);
    throw error;
  }
};

/**
 * ✅ Save diary entry
 * Add a new document to the /entries collection
 */
export const saveEntryToFirestore = async ({
  uid,
  date,
  content,
}: {
  uid: string;
  date: Date;
  content: string;
}) => {
  try {
    await addDoc(collection(db, 'entries'), {
      uid,
      date: Timestamp.fromDate(date),
      content,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('❌ Failed to save diary entry:', error);
    throw error;
  }
};

/**
 * ✅ Diary entry type
 */
type DiaryEntry = {
  id: string;
  uid: string;
  date: Timestamp;
  content: string;
  createdAt?: Timestamp;
};

/**
 * ✅ Fetch diary entries by date
 */
export const fetchUserEntriesByDate = async (
  uid: string,
  date: Date
): Promise<DiaryEntry[]> => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, 'entries'),
    where('uid', '==', uid),
    where('date', '>=', Timestamp.fromDate(start)),
    where('date', '<=', Timestamp.fromDate(end))
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<DiaryEntry, 'id'>),
  }));
};

/**
 * ✅ Fetch all diary entries for a user
 */
export const fetchAllUserEntries = async (
  uid: string
): Promise<DiaryEntry[]> => {
  const q = query(collection(db, 'entries'), where('uid', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<DiaryEntry, 'id'>),
  }));
};

/**
 * ✅ Search diary entries by keyword
 */
export const fetchUserEntriesByKeyword = async (
  uid: string,
  keyword: string
): Promise<DiaryEntry[]> => {
  const q = query(collection(db, 'entries'), where('uid', '==', uid));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<DiaryEntry, 'id'>),
    }))
    .filter((entry) => entry.content?.includes(keyword));
};
