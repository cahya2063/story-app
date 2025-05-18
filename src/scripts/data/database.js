import { openDB } from "idb";

const DATABASE_NAME = 'storyku'
const DATABASE_VERSION = 1
const OBJECT_STORE_NAME = 'cerita-tersimpan'

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade: (database)=>{
        database.createObjectStore(OBJECT_STORE_NAME, {
            keyPath: 'id'
        })
    }
})

export const saveStory = async (story) => {
  try {
    const db = await dbPromise;
    await db.put(OBJECT_STORE_NAME, story);
    console.log("Story berhasil disimpan");
    return true;
  } catch (error) {
    console.error("Failed to save story:", error);
    return false;
  }
};

export const getSavedStories = async () => {
  try {
    const db = await dbPromise;
    return await db.getAll(OBJECT_STORE_NAME);
  } catch (error) {
    console.error("Failed to get saved stories:", error);
    return [];
  }
};

export const deleteStory = async (id) => {
  try {
    const db = await dbPromise;
    await db.delete(OBJECT_STORE_NAME, id);
    console.log("Story berhasil dihapus");
    return true;
  } catch (error) {
    console.error("Failed to delete story");
    return false;
  }
};

export const checkIfStorySaved = async (id) => {
  try {
    const db = await dbPromise;
    return (await db.get(OBJECT_STORE_NAME, id)) !== undefined;
  } catch (error) {
    console.error("Failed to check story:", error);
    return false;
  }
};






