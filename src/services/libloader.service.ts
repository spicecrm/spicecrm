import {Subject, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {backend} from "./backend.service";

/**
 * a service class to dynamically load external libraries/scripts
 * source: https://stackoverflow.com/questions/42593604/using-external-javascript-libraries-in-angular-2-lazy-loaded-module-not-index-h
 * created and adapted by Sebastian Franz
 */
@Injectable()
export class LibLoaderService {
    private scripts = [];
    private is_ready = false;

    constructor(
       //  private backend: backend,
    ) {
        // load available libraries into this.scripts...
    }

    public load(...scripts: string[]): Observable<object> {
        if( !this.is_ready ) {
            this.load();
        }
        let observables: Observable<object>[] = [];
        scripts.forEach((script) => {
            observables.push(this.loadScript(script));
        });

        let sub = new Subject();
        let cnt = 0;
        for(let o of observables)
        {
            o.subscribe(
                (res) => {
                    cnt++;
                    console.log(cnt, res);
                },
                (err) => {
                    cnt++;
                    console.error(err);
                    sub.error(err);
                },
                () => {
                    // console.log("completed...", cnt == observables.length);
                    if( cnt == observables.length ) {
                        sub.next();
                        sub.complete();
                    }
                }
            );
        }
        // is needed in case of scripts are already loaded and completed before the subject can be subscribed...
        if( cnt == observables.length ) {
            return of(sub);
        } else {
            return sub.asObservable();
        }
    }

    private loadScript(name: string): Observable<object> {
        let sub = new Subject<object>();

        // error if not found... (but how?)
        if(!this.scripts[name]) {
            return of({script: name, loaded: false, status: "Unknown"});
        } else if (this.isLibLoaded(name)) {
            return of({script: name, loaded: true, status: "Already Loaded"});
        } else {
            // load script(s)
            let script: any = document.createElement("script");
            for(let lib of this.scripts[name]) {
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

    public isLibLoaded(name): boolean {
        if( this.scripts[name] ) {
            for(let lib of this.scripts[name])
            {
                if(!lib.loaded) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}
