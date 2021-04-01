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
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {footer} from './footer.service';
import {metadata} from './metadata.service';
import {toast} from './toast.service';
import {language} from './language.service';
import {modal} from './modal.service';

@Injectable()
export class mediafiles {

    private categoriesLoaded: boolean = false;
    public categories: object = {};
    public categoriesSorted = [];

    constructor(
        private sanitizer: DomSanitizer,
        private http: HttpClient,
        private backend: backend,
        private configurationService: configurationService,
        private session: session,
        private metadata: metadata,
        private footer: footer,
        private toast: toast,
        private language: language,
        private modalservice: modal,
    ) {
    }


    private _getImage(mediaId: string, variant: string = '') {
        let responseSubject = new Subject<any>();
        // { 'If-None-Match': '1234567890'  }
        this.backend.getRawRequest('module/MediaFiles/' + mediaId + '/file' + (variant != '' ? '/' : '') + variant, {}, null, {}).subscribe((response: any) => {
            let objectUrl = URL.createObjectURL(response);
            responseSubject.next(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
            responseSubject.complete();
        });
        return responseSubject.asObservable();
    }

    private _getImageBase64(mediaId: string) {
        let responseSubject = new Subject<any>();
        // { 'If-None-Match': '1234567890'  }
        this.backend.getRequest('module/MediaFiles/' + mediaId + '/base64').subscribe((response: any) => {
            responseSubject.next(response);
            responseSubject.complete();
        });
        return responseSubject.asObservable();
    }


    public getImageVariant(mediaId: string, variant: string) {
        return this._getImage(mediaId, variant);
    }

    public getImage(mediaId: string) {
        return this._getImage(mediaId, '');
    }

    public getImageBase64(mediaId: string) {
        return this._getImageBase64(mediaId);
    }

    public getImageThumb(mediaId: string, size: number) {
        return this._getImage(mediaId, 'th/' + size);
    }

    public getImageSquare(mediaId: string, size: number) {
        return this._getImage(mediaId, 'sq/' + size);
    }

    /*
    public uploadFile(files): Observable<any> {

        if (files.length === 0) return;

        let retSub = new Subject<any>();

        let data = new FormData();
        data.append('file', files[0], files[0].name);

        let request = new XMLHttpRequest();
        let resp: any = {};

        request.onreadystatechange = function (scope: any = this) {
            if (request.readyState == 4) {
                try {
                    let retVal = JSON.parse(request.response);
                    retSub.next({filedata: retVal});
                    retSub.complete();
                } catch (e) {
                    resp = {
                        status: 'error',
                        data: 'Unknown error occurred: [' + request.responseText + ']'
                    };
                }
            }
        };

        request.upload.addEventListener('progress', (e: any) => {
            retSub.next({progress: {total: e.total, loaded: e.loaded}});
            // console.log('progress' + e.loaded + '/' + e.total + '=' + Math.ceil(e.loaded/e.total) * 100 + '%');
        }, false);

        request.open('POST', this.configurationService.getBackendUrl() + '/module/MediaFiles/fileupload', true);
        request.setRequestHeader('OAuth-Token', this.session.authData.sessionId);
        request.send(data);

        return retSub.asObservable();
    }
    */

    public getMediaFile( noImagePicker = false, noMetaData = false, category: string): Observable<any> {

        let retSubject = new Subject();
        if (noImagePicker) {
            this.uploadMediaFile([], noMetaData, category).subscribe((answer) => {
                if (answer) {
                    retSubject.next(answer);
                    retSubject.complete();
                }
            });
        } else {
            this.pickMediaFile().subscribe((answer) => {
                if (answer.id) {
                    retSubject.next(answer.id);
                    retSubject.complete();
                } else if (answer.upload === true) {
                    this.uploadMediaFile([], noMetaData, category).subscribe((answer) => {
                        if (answer) {
                            retSubject.next(answer);
                            retSubject.complete();
                        }
                    });
                }
            });
        }
        return retSubject.asObservable();
    }

    private pickMediaFile(): Observable<any> {
        let retSubject = new Subject();
        this.modalservice.openModal('MediaFilePicker').subscribe(picker => {
            picker.instance.answer.subscribe(answer => {
                retSubject.next(answer); // return the answer
                retSubject.complete();
            });
        });
        return retSubject.asObservable();
    }

    // todo: acceptFileTypes
    private uploadMediaFile(acceptFileTypes: string[], noMetaData = false, category: string): Observable<any> {
        let retSubject = new Subject();
        this.modalservice.openModal('MediaFileUploader').subscribe(uploader => {
            uploader.instance.acceptFileTypes = acceptFileTypes;
            uploader.instance.noMetaData = noMetaData;
            uploader.instance.category = category;
            uploader.instance.answer.subscribe(answer => {
                retSubject.next(answer); // return the answer
                retSubject.complete();
            });
        });
        return retSubject.asObservable();
    }

    /* Code for Media Categories */

    /*
    private makeFullName(category: any) {
        if (category.parent === null) return (category.fullName = category.name);
        else return (category.fullName = this.makeFullName(category.parent) + ' > ' + category.name);
    }

    private setFullName(category: any) {
        if (category.fullName) return;
        else category.fullName = this.makeFullName(category);
    }

    public loadCategories() {

        let responseSubject = new Subject();

        if (this.categoriesLoaded) {
            setTimeout(() => {
                responseSubject.next();
                responseSubject.complete();
            }, 1);
            return responseSubject;
        }

        let paramsCategories = {
            fields: JSON.stringify(['id', 'name', 'parent_id']),
            sortfield: 'name',
            limit: -99
        };

        this.backend.getRequest('module/MediaCategories', paramsCategories).subscribe((response: any) => {
            for (let c of response.list) {
                this.categories[c.id] = c;
                this.categoriesSorted.push(c);
            }
            for (let c in this.categories) this.categories[c].parent = (this.categories[c].parent_id && this.categories[c].parent_id != '') ? this.categories[this.categories[c].parent_id] : null;
            for (let c in this.categories) this.setFullName(this.categories[c]);
            this.categoriesSorted.sort((a, b) => {
                return a.fullName.localeCompare(b.fullName); // return ( a.fullName > b.fullName ) ? 1 : (( b.fullName > a.fullName ) ? -1 : 0 );
            });
            this.categoriesLoaded = true;
            responseSubject.next();
            responseSubject.complete();
        }, error => {
            this.toast.sendToast(this.language.getLabel('ERR_NETWORK_LOADING'), 'error', 'To retry: Close and reopen the window.', false);
        });

        return responseSubject.asObservable();

    }

    public fileIsInCategory(needleID: string, category: any) {
        if (!this.categoriesLoaded || !needleID || needleID == '' || !category) return false;
        if (!this.categories[needleID]) return false;
        if (needleID === category.id) return true;
        else return this.isChild(category, this.categories[needleID]);
    }

    private isChild(possibleParent, possibleChild) {
        if (!possibleChild.parent) return false;
        if (possibleParent.id === possibleChild.parent_id) return true;
        else return this.isChild(possibleParent, possibleChild.parent);
    }
    */

}
