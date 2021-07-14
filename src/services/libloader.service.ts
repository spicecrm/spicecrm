/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    private loadedLibs: lib[] = [];

    /**
     * ToDo: implement the handler here
     *
     * an event emitter for the libs .. emits when a specific lib has been loaded
     * this is useful if the same li b is loading twice
     */
    private loadedLibs$: EventEmitter<object> = new EventEmitter<object>();

    /**
     * holds all scripts thar are loaded riect alreads
     */
    private loadedDirect: string[] = [];

    constructor(private configuration: configurationService) {
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
                        sub.next();
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
    private async loadScriptsDirect(scripts): Promise<any> {
        let sub = new Subject();
        let loadedcount = 0;
        for (let lib of scripts) {
            await this.loadScriptDirect(lib.src).then(
                success => {
                    loadedcount++;
                    if (loadedcount == scripts.length) {
                        sub.next({script: name, loaded: true, status: "Loaded"});
                        sub.complete();
                    }
                },
                error => {
                    sub.error({script: name, loaded: false, status: "error"});
                    sub.complete();
                }
            );
        }
        return sub.toPromise();
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
    private async loadScriptDirect(src: string): Promise<boolean> {
        if (this.loadedDirect.indexOf(src) != -1) {
            return of(true).toPromise();
        } else {
            let sub = new Subject<boolean>();
            // create the elemnt as script or stylesheet
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
                        sub.next(true);
                        sub.complete();
                    }
                };
            } else {  // Others
                element.onload = () => {
                    sub.next(true);
                    sub.complete();
                };
            }
            element.onerror = (error: any) => {
                sub.error(false);
                sub.complete();
            };
            document.getElementsByTagName("head")[0].appendChild(element);
            return sub.toPromise();
        }
    }

    /**
     * check if a specific lib is loaded already
     *
     * @param name the name of the lib package
     */
    private isLibLoaded(name): boolean {
        return this.loadedLibs.find(lib => lib.name == name && lib.status == 'loaded') ? true : false;
    }

    /**
     * check if a specific lib is loaded already
     *
     * @param name the name of the lib package
     */
    private isLibLoading(name): boolean {
        return this.loadedLibs.find(lib => lib.name == name && lib.status == 'loading') ? true : false;
    }
}
