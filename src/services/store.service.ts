import {Injectable} from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    /**
     * holds the open databases instances
     * @private
     */
    private databases: { [key: string]: IDBDatabase } = {};

    /**
     * create a new indexed db and returns an instance of it as a promise
     * @param dbName
     */
    private openDB(dbName: string): Promise<{event: 'success' | 'upgrade', db: IDBDatabase}> {
        return new Promise((resolve, reject) => {

            if (!indexedDB) reject('IndexedDB not available');

            const request = indexedDB.open(dbName, 2);

            request.onsuccess = () => {
                this.databases[dbName] = request.result;
                resolve({event: 'success', db: request.result});
            }

            request.onerror = () => {
                reject(`IndexedDB error: ${request.error}`)
            };

            request.onupgradeneeded = () => {
                this.databases[dbName] = request.result;
                resolve({event: 'upgrade', db: request.result});
            }
        });
    }

    /**
     * open or get the saved db connection and then initialize the given stores
     * @param dbName
     * @param storeNames
     * @param primaryKey
     */
    public initializeStores(dbName: string, storeNames: string[], primaryKey: string): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.databases[dbName]) {
                storeNames.forEach(storeName =>
                    this.databases[dbName].createObjectStore(storeName, {keyPath: "id"})
                );

                resolve(true);
                return;
            }

            this.openDB(dbName).then((data: {event: 'upgrade' | 'success', db: IDBDatabase}) => {

                if (data.event == 'upgrade') {
                    storeNames.forEach(storeName =>
                        data.db.createObjectStore(storeName, {keyPath: primaryKey})
                    );
                }

                resolve(true);
            });
        });
    }

    /**
     * read the data of the store object and emit it as observable
     * @param dbName
     * @param storeName
     * @param id
     */
    public readStore(dbName, storeName, id?): Observable<any> {

        if (!this.databases[dbName]) {
            const error = !indexedDB ? 'no indexedDB Support' : 'Database with the given name does not exist';
            return throwError(() => new Error(error));
        }

        const retSubject = new Subject<any>();
        const transaction = this.databases[dbName].transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.get(id);

        request.onerror = () => retSubject.error(false);

        request.onsuccess = (event) => {
            const data = (event.target as IDBRequest).result?.data;
            if (data) {
                retSubject.next(data);
                retSubject.complete();
            } else {
                retSubject.error(false);
            }
        };

        return retSubject.asObservable();
    }

    /**
     * read store object and emit it as observable
     * @param dbName
     * @param storeName
     */
    public readStoreAll(dbName: string, storeName: string): Promise<any> {
        return new Promise((resolve, reject) => {

            if (!this.databases[dbName]) {
                return reject('no indexedDB Support');
            }

            const transaction = this.databases[dbName].transaction([storeName], "readwrite");
            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.getAll();

            request.onerror = () => reject();

            request.onsuccess = (event) => {
                const records: any[] = (event.target as IDBRequest).result;

                if (records?.length > 0) {
                    resolve(records);
                } else {
                    reject();
                }
            };
        });
    }

    /**
     * writes a data object to the indexed db
     * @param dbName
     * @param storeName
     * @param data
     */
    public writeStore(dbName: string, storeName: string, data) {

        if (!this.databases[dbName]) return;

        this.databases[dbName].transaction([storeName], "readwrite")
            .objectStore(storeName)
            .put(data);
    }

    /**
     * clear the db data
     * @param dbName
     * @param storeNames
     */
    public clearDB(dbName: string, storeNames: string[]) {

        if (!this.databases[dbName]) return;

        const transaction = this.databases[dbName].transaction(storeNames, "readwrite");

        storeNames.forEach(storeName => {
            transaction.objectStore(storeName).clear();
        })
    }
}