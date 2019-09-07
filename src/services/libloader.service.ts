/**
 * @module services
 */
import {Subject, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {backend} from "./backend.service";

/**
 * a service class to dynamically load external libraries/scripts
 * source: https://stackoverflow.com/questions/42593604/using-external-javascript-libraries-in-angular-2-lazy-loaded-module-not-index-h
 * created and adapted by Sebastian Franz
 */

@Injectable()
export class libloader {

    private scripts = [];

    private is_ready = false;

    /**
     * holds all scripts thar are loaded riect alreads
     */
    private loadedDirect: string[] = [];

    constructor() {
        // load available libraries into this.scripts...
    }

    public load(...scripts: string[]): Observable<object> {
        if (!this.is_ready) {
            this.load();
        }
        let observables: Array<Observable<object>> = [];
        scripts.forEach((script) => {
            observables.push(this.loadScript(script));
        });

        let sub = new Subject();
        let cnt = 0;
        for (let o of observables) {
            o.subscribe(
                (res) => {
                    cnt++;
                },
                (err) => {
                    cnt++;
                    sub.error(err);
                },
                () => {
                    // console.log("completed...", cnt == observables.length);
                    if (cnt == observables.length) {
                        sub.next();
                        sub.complete();
                    }
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

    private loadScript(name: string): Observable<object> {
        let sub = new Subject<object>();

        // error if not found... (but how?)
        if (!this.scripts[name]) {
            return of({script: name, loaded: false, status: "Unknown"});
        } else if (this.isLibLoaded(name)) {
            return of({script: name, loaded: true, status: "Already Loaded"});
        } else {
            // load script(s)
            let script: any = document.createElement("script");
            for (let lib of this.scripts[name]) {
                script.type = "text/javascript";
                script.src = lib.src;
                if (script.readyState) {  // IE
                    script.onreadystatechange = () => {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            lib.loaded = true;
                            sub.next({script: lib.src, loaded: true, status: "Loaded"});
                            sub.complete();
                        }
                    };
                } else {  // Others
                    script.onload = () => {
                        lib.loaded = true;
                        sub.next({script: lib.src, loaded: true, status: "Loaded"});
                        sub.complete();
                    };
                }
                script.onerror = (error: any) => {
                    sub.error({script: lib.src, loaded: false, status: "Failed"});
                };
                document.getElementsByTagName("head")[0].appendChild(script);
            }
        }

        return sub.asObservable();
    }

    public loadFromSource(sources: string[]): Observable<boolean> {
        let sub = new Subject<boolean>();
        let resolved = 0;
        for (let source of sources) {
            this.loadScriptDirect(source).subscribe(
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
     * loads a cript direct form the source specified
     *
     * @param src the source to be loaded
     */
    public loadScriptDirect(src: string): Observable<boolean> {
        if (this.loadedDirect.indexOf(src) != -1) {
            return of(true);
        } else {
            let sub = new Subject<boolean>();
            let script: any = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            if (script.readyState) {  // IE
                script.onreadystatechange = () => {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        sub.next(true);
                        sub.complete();
                    }
                };
            } else {  // Others
                script.onload = () => {
                    sub.next(true);
                    sub.complete();
                };
            }
            script.onerror = (error: any) => {
                sub.error(false);
                sub.complete();
            };
            document.getElementsByTagName("head")[0].appendChild(script);
            return sub.asObservable();
        }
    }

    public isLibLoaded(name): boolean {
        if (this.scripts[name]) {
            for (let lib of this.scripts[name]) {
                if (!lib.loaded) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}
