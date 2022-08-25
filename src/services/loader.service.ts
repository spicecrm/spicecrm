/**
 * @module services
 */
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject, Observable, of, throwError} from 'rxjs';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {language} from './language.service';
import {broadcast} from './broadcast.service';

@Injectable()
export class loader {
    public module: string = '';
    public id: string = '';
    public data: any = {};
    public loaderHandler: Subject<string> = new Subject<string>();
    public loadComplete: Subject<boolean>;
    public start: any = '';
    public counterCompleted = 0;
    public progress = 0;
    public activeLoader: string = '';
    public loadPhase: string = 'system';

    private db: any;

    public loadElements: any = {
        system: [
            {
                name: 'getLanguage',
                display: 'Language',
                status: 'initial',
                sequence: 35,
                action: (loader) => {
                    loader.language.getLanguage(loader.loaderHandler);
                }
            }
        ],
        primary: [],
        secondary: []
    };

    constructor(
        public http: HttpClient,
        public broadcast: broadcast,
        public configuration: configurationService,
        public session: session,
        public language: language
    ) {
        this.loaderHandler.subscribe(val => this.handleLoaderHandler());
        this.openDB('loaddata').then(
            db => {
                this.db = db;
            }
        );

        // subscribe to the broadcast to catch the logout
        this.broadcast.message$.subscribe(message => this.handleLogout(message));
    }

    /**
     * gets the set tasks from teh backend
     */
    public getLoadTasks(): Observable<boolean> {
        let retSubject = new Subject<boolean>();
        this.readStoreAll('loadtasks').subscribe({
            next: (records) => {
                this.processLoadTasks(records, false);
                // resolve the subject to start the loader
                retSubject.next(true);
                retSubject.complete();
            },
            error: () => {
                this.getLoadTasksFromBackend(retSubject);
            }
        })

        return retSubject.asObservable();
    }

    private getLoadTasksFromBackend(retSubject){
        this.http.get(
            this.configuration.getBackendUrl() + "/system/spiceui/core/loadtasks", {headers: this.session.getSessionHeader()}).subscribe(
            (loadtasks: any) => {

                this.processLoadTasks(loadtasks);

                // resolve the subject to start the loader
                retSubject.next(true);
                retSubject.complete();
            }
        );
    }

    private processLoadTasks(loadtasks: any, store: boolean = true){
        // reset the primary tasks
        this.loadElements.primary = [];
        this.loadElements.secondary = [];

        // add the loadtasks to the elements defined as fixed
        for (let loadtask of loadtasks) {
            loadtask.status = 'initial';
            this.loadElements[loadtask.phase].push(loadtask);

            // write to the store
            if(store) this.writeStore('loadtasks', loadtask.id, loadtask);
        }

        // sort the loader arrays
        this.loadElements.primary.sort((a, b) => {
            return parseInt(a.sequence, 10) > parseInt(b.sequence, 10) ? 1 : -1;
        });

        // sort the loader arrays
        this.loadElements.secondary.sort((a, b) => {
            return parseInt(a.sequence, 10) > parseInt(b.sequence, 10) ? 1 : -1;
        });
    }

    /**
     * opens an indexed DB in the browser to store the config data
     *
     * @param dbname
     * @private
     */
    private openDB(dbname): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            if (!indexedDB) {
                reject('IndexedDB not available');
            }
            const request = indexedDB.open(dbname, 2);
            let db: IDBDatabase;
            request.onsuccess = (event: Event) => {
                db = request.result;
                resolve(db);
            };
            request.onerror = (event: Event) => {
                reject(`IndexedDB error: ${request.error}`);
            };
            request.onupgradeneeded = (event: Event) => {
                db = request.result;
                db.createObjectStore("loadtaskdata", {keyPath: "id"});
                db.createObjectStore("loadtasks", {keyPath: "id"});
                resolve(db);
            };
        });
    }

    /**
     * writes a data set record to the db
     * @param id
     * @param data
     */
    public writeStore(store, id, data) {
        // just return if we do not have a db
        if(!this.db) return;

        // process the write
        this.db.transaction([store], "readwrite").objectStore(store).add({data, id});
    }

    /**
     * reads a data set record from the DB
     * @param id
     */
    public readStore(store, id?): Observable<any> {
        // if we do not have a db return an empty array
        if(!this.db) return throwError(() => new Error('no indexedDB Support'));

        let retSubject = new Subject<any>();
        let transaction = this.db.transaction([store], "readwrite");
        let objectStore = transaction.objectStore(store);
        let request = objectStore.get(id);
        request.onerror = (event) => {
            retSubject.error(false);
        };
        request.onsuccess = (event) => {
            if(event.target.result?.data) {
                retSubject.next(event.target.result.data);
                retSubject.complete();
            } else {
                retSubject.error(false);
            }
        };
        return retSubject.asObservable();
    }

    /**
     * reads all records from the DB in form of an array with the data attribute
     *
     * @param id
     */
    public readStoreAll(store): Observable<any> {
        // if we do not have a db return an empty array
        if(!this.db) return throwError(() => new Error('no indexedDB Support'));

        // process the request
        let retSubject = new Subject<any>();
        let transaction = this.db.transaction([store], "readwrite");
        let objectStore = transaction.objectStore(store);
        let request = objectStore.getAll()
        request.onerror = (event) => {
            retSubject.error(false);
        };
        request.onsuccess = (event) => {
            if(event.target.result && event.target.result.length > 0) {
                let records = [];
                for(let r of event.target.result){
                    records.push(r.data);
                }
                retSubject.next(records);
                retSubject.complete();
            } else {
                retSubject.error(false);
            }
        };
        return retSubject.asObservable();
    }

    /**
     * clears the db
     *
     * @private
     */
    public clearDB(){
        // only if we have a database
        if(!this.db) return;

        // clear the database
        let transaction = this.db.transaction(["loadtaskdata", "loadtasks"], "readwrite");
        transaction.objectStore('loadtasks').clear();
        transaction.objectStore('loadtaskdata').clear();
    }


    /**
     * handle the message broadcast and if messagetype is logout reset the data
     *
     * @param message the message received
     */
    public handleLogout(message) {
        if (message.messagetype == 'logout') {
            this.clearDB();
        }
    }


    /**
     * loads the condfiguration
     *
     * @param refresh - forces a refresh of the config resetting locally stored data
     */
    public load(refresh: boolean = true): Observable<boolean> {

        // clean the DBs for the config and also for the languages and config
        if(refresh){
            this.clearDB();
            this.language.clearDB();
            this.configuration.clearDB();
        }

        this.loadComplete = new Subject<boolean>();
        this.getLoadTasks().subscribe(loaded => {
            this.resetLoader();
            this.start = performance.now();
            this.handleLoaderHandler();
        });
        return this.loadComplete.asObservable();
    }

    public reloadPrimary() {
        this.loadComplete = new Subject<boolean>();

        // set the laodphase to primary
        this.loadPhase = 'primary';

        // reset the progress
        this.progress = 0;
        this.counterCompleted = 0;

        // reset the primary load elements
        for (let loaditem of this.loadElements.primary) {
            loaditem.status = 'initial';
        }

        // start the handler
        this.start = performance.now();
        this.handleLoaderHandler();

        // return the observable
        return this.loadComplete.asObservable();
    }

    public resetLoader() {
        // reset the progress
        this.counterCompleted = 0;
        this.progress = 0;

        this.loadPhase = 'system';

        for (let loaditem of this.loadElements.system) {
            loaditem.status = 'initial';
        }

        for (let loaditem of this.loadElements.primary) {
            loaditem.status = 'initial';
        }

        for (let loaditem of this.loadElements.secondary) {
            loaditem.status = 'initial';
        }
    }

    public reset() {
        this.counterCompleted = 0;
        this.progress = 0;

        for (let loaditem of this.loadElements.system) {
            loaditem.status = 'initial';
        }

        for (let loaditem of this.loadElements.primary) {
            loaditem.status = 'initial';
        }

        for (let loaditem of this.loadElements.secondary) {
            loaditem.status = 'initial';
        }
    }


    public setComplete() {
        let t1 = performance.now();
        if (t1 - this.start > 500) {
            this.complete();
        } else {
            setTimeout(() => this.complete(), 500);
        }
    }

    public complete() {
        // emit true
        this.loadComplete.next(true);
        this.loadComplete.complete();
    }

    public handleLoaderHandler() {
        let loadActive = false;

        for (let loadElement of this.loadElements[this.loadPhase]) {
            if (loadElement.status === 'active') {
                loadElement.status = 'completed';
                let p = ++this.counterCompleted / (this.loadElements.primary.length + this.loadElements.system.length) * 100
                if (p > 100) {
                    p == 100;
                }
                this.progress = p;
            } else if (loadElement.status === 'initial') {
                loadElement.status = 'active';
                if (loadElement.action) {
                    loadElement.action(this);
                } else {
                    this.handleRouteElement(loadElement);
                }
                loadActive = true;
                this.activeLoader = loadElement.display;
                break;
            }
        }

        if (loadActive === false && this.loadPhase == 'system') {
            this.loadPhase = 'primary';
            this.handleLoaderHandler();
        } else if (loadActive === false && this.loadPhase == 'primary') {
            // set complete
            this.setComplete();
            // switch to secondary phase
            this.loadPhase = 'secondary';

            // emit that the primary loader completed
            // allowing basic UI initialization if required in any area of the app
            this.broadcast.broadcastMessage('loader.primarycompleted');

            this.handleLoaderHandler();
        }

    }

    public handleRouteElement(loadElement) {
        this.readStore('loadtaskdata', loadElement.id).subscribe({
            next: (data) => {
                this.processLoadElementData(data);
                this.broadcast.broadcastMessage('loader.completed', loadElement.name);
                this.loaderHandler.next(loadElement.name);
            },
            error: () => {
                this.loadRouteElementFromBackend(loadElement);
            }
        });
    }

    /**
     * loads the element from the backend
     *
     * @param loadElement
     * @private
     */
    private loadRouteElementFromBackend(loadElement) {
        let loadroute = loadElement.route ? loadElement.route : '/system/spiceui/core/loadtasks/' + loadElement.id;
        this.http.get(
            this.configuration.getBackendUrl() + loadroute,
            {headers: this.session.getSessionHeader()}
        ).subscribe({
            next: (loadElementResults: any) => {
                // write to the database
                this.writeStore('loadtaskdata', loadElement.id, loadElementResults);

                // process the load Element Results
                this.processLoadElementData(loadElementResults);

                this.broadcast.broadcastMessage('loader.completed', loadElement.name);

                this.loaderHandler.next(loadElement.name);
            }
        });
    }

    /**
     * processes the loaded Data
     *
     * @param loadElementResults
     * @private
     */
    private processLoadElementData(loadElementResults) {
        for (let loadElementResultKey in loadElementResults) {
            this.configuration.setData(loadElementResultKey, loadElementResults[loadElementResultKey]);
        }
    }

}
