import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({
    providedIn: "root"
})
export class StorageService {
    private _storage: Storage | null = null;
    private storagePromise: Promise<Storage> | null = null;

    constructor(private storage: Storage) {}

    async ensureStorage(): Promise<Storage> {
        if (this._storage !== null) {
            return this._storage;
        }

        if (!this.storagePromise) {
            this.storagePromise = this.storage.create();
        }

        this._storage = await this.storagePromise;
        return this._storage;
    }

    public async set<T>(key: string, value: T): Promise<void> {
        const storage = await this.ensureStorage();
        await storage.set(key, value);
    }

    public async get<T>(key: string): Promise<T | null> {
        const storage = await this.ensureStorage();
        return await storage.get(key);
    }

    public async remove(key: string): Promise<void> {
        const storage = await this.ensureStorage();
        await storage.remove(key);
    }

    public async clear(): Promise<void> {
        const storage = await this.ensureStorage();
        await storage.clear();
    }
}
