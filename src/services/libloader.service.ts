/**
 * @module services
 */
import {EventEmitter, Injectable} from "@angular/core";
import {Subject, Observable, of} from "rxjs";
import {configurationService} from "./configuration.service";

/**
 * a service class to dynamically load external libraries/scripts
 * source: https://stackoverflow.com/questions/42593604/using-external-javascript-libraries-in-angular-2-lazy-loaded-module-not-index-h
 * created and adapted by Sebastian Franz
 */

interface lib {
    name: string;
    status: 'loaded' | 'loading' | 'error';
}

@Injectable()
export class libloader {

    /**
     * holds the packages as defined in the database are loaded
     */
    public loadedLibs: lib[] = [];

    /**
     * ToDo: implement the handler here
     *
     * an event emitter for the libs .. emits when a specific lib has been loaded
     * this is useful if the same li b is loading twice
     */
    public loadedLibs$: EventEmitter<object> = new EventEmitter<object>();

    /**
     * holds all scripts thar are loaded riect alreads
     */
    public loadedDirect: string[] = [];

    constructor(public configuration: configurationService) {
    }

    /**
     * loads the scripts from the config manager
     */
    get scripts() {
        return this.configuration.getData('scripts');
    }

    /**
     * loads an array of libraries with all scroipts per libray
     *
     * @param scripts
     */
    public loadLibs(...libs: string[]): Observable<any> {

        let observables: Array<Observable<any>> = [];
        libs.forEach((lib) => {
            observables.push(this.loadLib(lib));
        });

        let sub = new Subject();
        let cnt = 0;
        for (let o of observables) {
            o.subscribe(
                (res) => {
                    cnt++;
                    // console.log("completed...", cnt == observables.length);
                    if (cnt == observables.length) {
                        sub.next(true);
                        sub.complete();
                    }
                },
                (err) => {
                    cnt++;
                    sub.error(err);
                }
            );
        }
        // is needed in case of scripts are already loaded and completed before the subject can be subscribed...
        if (cnt == observables.length) {
            return of(sub);
        } else {
            return sub.asObservable();
        }
    }

    /**
     * loads a single library by the name
     *
     * @param name the name of the library
     */
    public loadLib(name: string): Observable<any> {
        // error if not found... (but how?)
        if (!this.scripts[name]) {
            return of({script: name, loaded: false, status: "Unknown"});
        } else if (this.isLibLoaded(name)) {
            return of({script: name, loaded: true, status: "Already Loaded"});
        } else if (this.isLibLoading(name)) {
            return this.loadedLibs$;
        } else {
            this.loadedLibs.push({name: name, status: 'loading'});
            let sub = new Subject<object>();
            // load script(s)
            this.loadScriptsDirect(this.scripts[name]).then(
                success => {
                    sub.next({script: name, loaded: true, status: "Loaded"});
                    sub.complete();

                    // set and emit internally
                    this.loadedLibs.find(lib => lib.name == name).status = 'loaded';
                    this.loadedLibs$.emit({script: name, loaded: true, status: "Loaded"});
                },
                error => {
                    sub.error({script: name, loaded: false, status: "error"});
                    sub.complete();

                    // emit the error internally if somebody else is waiting
                    this.loadedLibs.find(lib => lib.name == name).status = 'error';
                    this.loadedLibs$.emit({script: name, loaded: true, status: "error"});
                }
            );

            return sub.asObservable();
        }
    }

    /**
     * async function to load libs waiting for themn to be loaded ina  sequence
     *
     * @param scripts
     */
    public async loadScriptsDirect(scripts): Promise<any> {

        return new Promise(async (next, error) => {
            let loadedcount = 0;
            for (let lib of scripts) {
                await this.loadScriptDirect(lib.src).then(
                    success => {
                        loadedcount++;
                        if (loadedcount == scripts.length) {
                            next({script: lib.name, loaded: true, status: "Loaded"});
                        }
                    },
                    err => {
                        error({script: lib.name, loaded: false, status: "error"});
                    }
                );
            }
        });
    }

    /**
     * loads a set of libraries from the source definitions
     *
     * @param sources an array of fully qualified sources
     */
    public loadFromSource(sources: string[]): Observable<boolean> {
        let sub = new Subject<boolean>();
        let resolved = 0;
        for (let source of sources) {
            this.loadScriptDirect(source).then(
                res => {
                    resolved++;
                    if (resolved == sources.length) {
                        sub.next(true);
                        sub.complete();
                    }
                },
                error => {
                    sub.error(false);
                    sub.complete();
                }
            );
        }
        return sub.asObservable();
    }

    /**
     * loads a script direct form the source specified
     *
     * @param src the source to be loaded
     */
    public async loadScriptDirect(src: string): Promise<boolean> {
        if (this.loadedDirect.indexOf(src) != -1) {
            return Promise.resolve(true);
        } else {
            return new Promise((next, error) => {
                let element: any = {};
                if (src.endsWith('.css')) {
                    element = document.createElement("link");
                    element.rel = "stylesheet";
                    element.href = src;
                } else {
                    element = document.createElement("script");
                    element.type = "text/javascript";
                    element.src = src;
                }

                if (element.readyState) {  // IE
                    element.onreadystatechange = () => {
                        if (element.readyState === "loaded" || element.readyState === "complete") {
                            element.onreadystatechange = null;
                            next(true);
                        }
                    };
                } else {  // Others
                    element.onload = () => {
                        next(true);
                    };
                }
                element.onerror = (err: any) => {
                    error(false);
                };
                document.getElementsByTagName("head")[0].appendChild(element);
            })
        }
    }

    /**
     * check if a specific lib is loaded already
     *
     * @param name the name of the lib package
     */
    public isLibLoaded(name): boolean {
        return this.loadedLibs.find(lib => lib.name == name && lib.status == 'loaded') ? true : false;
    }

    /**
     * check if a specific lib is loaded already
     *
     * @param name the name of the lib package
     */
    public isLibLoading(name): boolean {
        return this.loadedLibs.find(lib => lib.name == name && lib.status == 'loading') ? true : false;
    }
}
