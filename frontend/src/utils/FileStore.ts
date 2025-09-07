import { openDB } from 'idb';

export const initIDB = async () => {
  return openDB('mediaDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', {
          autoIncrement: true
        });
      }
    }
  });
};

export const saveFile = async (file: File): Promise<number> => {
  try {
    const db = await initIDB();
    const tx = db.transaction('files', 'readwrite');
    const store = tx.objectStore('files');
    const key = await store.add(file);
    await tx.done;
    console.log(`File saved with key: ${key}`);
    return key as number;
  } catch (err) {
    console.error(`Failed to save file`, err);
    throw err;
  }
};

export const getFile = async (id: number): Promise<File | null> => {
  try {
    const db = await initIDB();
    const tx = db.transaction('files', 'readonly');
    const store = tx.objectStore('files');
    const file = await store.get(id);
    return file ?? null;
  } catch (err) {
    console.error(`Failed to get file: ${id}`, err);
    return null;
  }
};

export const clearIDB = async (): Promise<void> => {
  try {
    const db = await initIDB();
    const tx = db.transaction('files', 'readwrite');
    const store = tx.objectStore('files');
    await store.clear();
    await tx.done;
    console.log('All files cleared from DB');
  } catch (err) {
    console.error('Failed to clear DB', err);
    throw err;
  }
};
