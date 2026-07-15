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

export const firestoreService = {
  async saveBlueprint(newBlueprint: Blueprint): Promise<string> {
    const path = "blueprints";
    try {
      const optimizedStorage = removeUndefined({
        name: newBlueprint.name,
        timestamp: Timestamp.now(),
        summary: newBlueprint.pitch,
        branding: newBlueprint.branding,
        blueprint: newBlueprint,
        updatedAt: Timestamp.now(),
        status: 'complete'
      });
      const docRef = await addDoc(collection(db, path), optimizedStorage);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  },

  async updateBlueprint(id: string, data: Partial<Blueprint>): Promise<void> {
    const path = `blueprints/${id}`;
    try {
      const sanitizedData = removeUndefined(data);
      await updateDoc(doc(db, "blueprints", id), sanitizedData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  },

  async deleteBlueprint(id: string): Promise<void> {
    const path = `blueprints/${id}`;
    try {
      await deleteDoc(doc(db, "blueprints", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
      throw error;
    }
  },

  async fetchBlueprints(): Promise<Blueprint[]> {
    const path = "blueprints";
    try {
      const q = query(collection(db, path), orderBy("updatedAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        updatedAt: doc.data().updatedAt instanceof Timestamp ? doc.data().updatedAt.toDate().toISOString() : doc.data().updatedAt
      } as Blueprint));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      throw error;
    }
  }
};
