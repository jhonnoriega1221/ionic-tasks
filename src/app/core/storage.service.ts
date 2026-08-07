import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({
    providedIn: "root"
})
export class StorageService {
    private stores: { [storeName: string]: Storage } = {};
    private promises: { [storeName: string]: Promise<Storage> } = {};

    constructor() {}

    async ensureStorage(storeName: string): Promise<Storage> {
        if (this.stores[storeName]) {
            return this.stores[storeName];
        }

        if (!this.promises[storeName]) {
            this.promises[storeName] = this.initStore(storeName);
        }

        this.stores[storeName] = await this.promises[storeName];
        return this.stores[storeName];
    }

    private async initStore(storeName: string): Promise<Storage> {
        const store = new Storage({
            name: "__tododb",
            storeName: storeName
        });
        await store.create();
        return store;
    }

    public async set<T>(storeName: string, key: string, value: T): Promise<void> {
        const storage = await this.ensureStorage(storeName);
        await storage.set(key, value);
    }

    public async setMultiple<T extends { id: string }>(
        storeName: string,
        items: T[]
    ): Promise<void> {
        const storage = await this.ensureStorage(storeName);

        const promises = items.map((item) => storage.set(item.id, item));

        await Promise.all(promises);
    }

    public async get<T>(storeName: string, key: string): Promise<T | null> {
        const storage = await this.ensureStorage(storeName);
        return await storage.get(key);
    }

    public async remove(storeName: string, key: string): Promise<void> {
        const storage = await this.ensureStorage(storeName);
        await storage.remove(key);
    }

    public async clear(storeName: string): Promise<void> {
        const storage = await this.ensureStorage(storeName);
        await storage.clear();
    }

    public async forEach<T>(
        storeName: string,
        callback: (value: T, key: string, iterationNumber: Number) => void
    ): Promise<void> {
        const storage = await this.ensureStorage(storeName);
        await storage.forEach(callback);
    }
}
