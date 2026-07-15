import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Blueprint } from '../types';
import { removeUndefined } from '../utils/removeUndefined';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await wait(RETRY_DELAY);
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}

export const firestoreService = {
  async saveBlueprint(newBlueprint: Blueprint): Promise<string> {
    const path = "blueprints";
    return withRetry(async () => {
      try {
        const optimizedStorage = removeUndefined({
          ...newBlueprint,
          updatedAt: Timestamp.now(),
          status: 'complete'
        });
        const docRef = await addDoc(collection(db, path), optimizedStorage);
        return docRef.id;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
        throw error;
      }
    });
  },

  async updateBlueprint(id: string, data: Partial<Blueprint>): Promise<void> {
    const path = `blueprints/${id}`;
    return withRetry(async () => {
      try {
        const sanitizedData = removeUndefined({
          ...data,
          updatedAt: Timestamp.now()
        });
        await updateDoc(doc(db, "blueprints", id), sanitizedData);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
        throw error;
      }
    });
  },

  async deleteBlueprint(id: string): Promise<void> {
    const path = `blueprints/${id}`;
    return withRetry(async () => {
      try {
        await deleteDoc(doc(db, "blueprints", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
        throw error;
      }
    });
  },

  async fetchBlueprints(): Promise<Blueprint[]> {
    const path = "blueprints";
    return withRetry(async () => {
      try {
        const q = query(collection(db, path), orderBy("updatedAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            ...data,
            id: doc.id, 
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt
          } as Blueprint;
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
        throw error;
      }
    });
  }
};
