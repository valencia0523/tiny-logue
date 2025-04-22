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
 * ✅ 사용자 정보 저장 (개인 데이터)
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
    console.error('❌ Firestore 저장 실패:', error);
    throw error;
  }
};

/**
 * ✅ 닉네임 중복 확인
 * /nicknames/{nickname} 문서 존재 여부 확인
 */
export const isNicknameTaken = async (nickname: string): Promise<boolean> => {
  const docRef = doc(db, 'nicknames', nickname);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

/**
 * ✅ 닉네임 등록
 * /nicknames/{nickname} 문서 생성 (uid로 소유자 추적 가능)
 */
export const registerNickname = async (nickname: string, uid: string) => {
  try {
    await setDoc(doc(db, 'nicknames', nickname), {
      uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('❌ 닉네임 등록 실패:', error);
    throw error;
  }
};

/**
 * ✅ 일기 저장
 * /entries 컬렉션에 새로운 일기 문서 추가
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
    console.error('❌ 일기 저장 실패:', error);
    throw error;
  }
};

/**
 * ✅ 날짜별 일기 조회
 */

type DiaryEntry = {
  id: string;
  uid: string;
  date: Timestamp;
  content: string;
  createdAt?: Timestamp;
};

export const fetchUserEntriesByDate = async (uid: string, date: Date) => {
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
    ...(doc.data() as any),
  }));
};

/**
 * ✅ 키워드 검색 기반 일기 조회
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
