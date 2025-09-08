import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "mediaDB";
const DB_VERSION = 1;

type Entity = "culture" | "post";
type ImageType = "editor" | "details";

const getStoreName = (entity: Entity, type?: ImageType): string[] => {
  if(type) {
    return [`${entity}_${type}Images`];
  } else {
    return [`${entity}_detailsImages`,`${entity}_editorImages`]
  }
}

export const initIDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db: IDBPDatabase) {
      const entities: Entity[] = ["culture", "post"];
      const types: ImageType[] = ["editor", "details"];

      for (const entity of entities) {
        for (const type of types) {
          const store = getStoreName(entity, type)[0];
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { autoIncrement: true });
          }
        }
      }
    },
  });
};

export const saveFile = async (
  opts: { entity: Entity; type: ImageType },
  file: File
): Promise<number> => {
  const store = getStoreName(opts.entity, opts.type)[0];
  const db = await initIDB();
  const tx = db.transaction(store, "readwrite");
  const key = await tx.objectStore(store).add(file);
  await tx.done;
  console.log(`File saved in ${store} with key: ${key}`);
  return key as number;
};

export const getFile = async (
  opts: { entity: Entity; type: ImageType },
  id: number
): Promise<File | null> => {
  const store = getStoreName(opts.entity, opts.type)[0];
  const db = await initIDB();
  const tx = db.transaction(store, "readonly");
  const file = await tx.objectStore(store).get(id);
  return file ?? null;
};

export const clearStore = async (opts: {
  entity: Entity;
  type: ImageType;
}): Promise<void> => {
  const store = getStoreName(opts.entity, opts.type)[0];
  const db = await initIDB();
  const tx = db.transaction(store, "readwrite");
  await tx.objectStore(store).clear();
  await tx.done;
  console.log(`Cleared store: ${store}`);
};

export const clearEntityStore = async (opts: {
  entity: Entity;
}): Promise<void> => {
  const storeNames = getStoreName(opts.entity);
  const db = await initIDB();
  for(const store of storeNames) {
    const tx = db.transaction(store, "readwrite");
    await tx.objectStore(store).clear();
    await tx.done;
    console.log(`Cleared store: ${store}`);
  }
};

export const clearAllStores = async (): Promise<void> => {
  const db = await initIDB();
  const storeNames = Array.from(db.objectStoreNames);
  for (const name of storeNames) {
    const tx = db.transaction(name, "readwrite");
    await tx.objectStore(name).clear();
    await tx.done;
    console.log(`Cleared store: ${name}`);
  }
};

