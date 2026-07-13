import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'biznxt_drafts_db';
const DB_VERSION = 1;
const STORE_NAME = 'form_drafts';

class FormDraftsDB {
  private dbPromise: Promise<IDBPDatabase<any>> | null = null;

  private init() {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.reject(new Error('IndexedDB not supported'));
    }

    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });

    return this.dbPromise;
  }

  async saveDraft(id: string, data: any): Promise<void> {
    const db = await this.init();
    const record = {
      id,
      data,
      updatedAt: new Date().toISOString()
    };
    await db.put(STORE_NAME, record);
  }

  async getDraft(id: string): Promise<any | null> {
    const db = await this.init();
    const result = await db.get(STORE_NAME, id);
    return result ? result.data : null;
  }

  async deleteDraft(id: string): Promise<void> {
    const db = await this.init();
    await db.delete(STORE_NAME, id);
  }
}

export const formDraftsDB = new FormDraftsDB();

