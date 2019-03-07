/**
 * @module services
 */
import {Injectable} from "@angular/core";
import {Subject, Observable} from "rxjs";

import {configurationService} from "./configuration.service";
import {session} from "./session.service";
import {backend} from "./backend.service";
import {toast} from "./toast.service";
import {language} from "./language.service";

/**
* @ignore
*/
declare var moment: any;

@Injectable()
export class modelattachments {
    public module: string = "";
    public id: string = "";
    public items: any = [];
    public count: number = 0;
    public files: any[] = [];
    public loading: boolean = false;

    private serviceSubscriptions: any[] = [];

    constructor(
        private backend: backend,
        private configurationService: configurationService,
        private session: session,
        private toast: toast,
        private language: language
    ) {
    }

    public getAttachments() {
        this.resetData();
        this.loading = true;
        this.backend.getRequest("module/" + this.module + "/" + this.id + "/attachment/ui").subscribe(
            response => {
                for (let file of response) {
                    file.date = new moment(file.date);
                    this.files.push(file);
                }
                this.loading = false;
                // this.files = response;
            },
            error => {
                this.loading = false;
            });
    }

    public humanFileSize(filesize) {
        let thresh = 1024;
        let bytes: number = filesize;
        if (Math.abs(filesize) < thresh) {
            return bytes + " B";
        }
        let units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + " " + units[u];
    }

    /*
    * deprecated: replaces by uploadAttachmentsBase64
    */
    public uploadAttachments(files): Observable<any> {
        if (files.length === 0) {
            return;
        }

        let retSub = new Subject<any>();

        // let params: Array<string> = [];
        // params.push("sessionid=" + this.session.authData.sessionId);

        let data = new FormData();
        data.append("file", files[0], files[0].name);

        let request = new XMLHttpRequest();
        let resp: any = {};
        request.onreadystatechange = (scope: any = this) => {
            if (request.readyState == 4) {
                try {
                    let retVal = JSON.parse(request.response);
                    retSub.next({files: retVal});
                    retSub.complete();
                } catch (e) {
                    resp = {
                        status: "error",
                        data: "Unknown error occurred: [" + request.responseText + "]"
                    };
                }
            }
        };

        request.upload.addEventListener("progress", (e: any) => {
            retSub.next({progress: {total: e.total, loaded: e.loaded}});
        }, false);

        request.open("POST", this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment/ui", true);
        request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
        request.send(data);

        return retSub.asObservable();
    }

    public uploadAttachmentsBase64(files): Observable<any> {
        if (files.length === 0) {
            return;
        }

        let retSub = new Subject<any>();
        let maxSize = this.configurationService.getSystemParamater('upload_maxsize');

        for (let file of files) {

            // check max filesize
            if (maxSize && file.size > maxSize) {
                this.toast.sendToast(this.language.getLabelFormatted('LBL_EXCEEDS_MAX_UPLOADFILESIZE', [file.name, this.humanFileSize(maxSize)]), 'error');
                continue;
            }

            let newfile = {
                date: new moment(),
                file: '',
                file_mime_type: file.type,
                filesize: file.size,
                filename: file.name,
                id: '',
                text: '',
                thumbnail: '',
                user_id: '1',
                user_name: 'admin',
                uploadprogress: 0
            };
            this.files.unshift(newfile);

            this.readFile(file).subscribe(filecontent => {
                let request = new XMLHttpRequest();
                let resp: any = {};
                request.onreadystatechange = (scope: any = this) => {
                    if (request.readyState == 4) {
                        try {
                            let retVal = JSON.parse(request.response);

                            newfile.id = retVal[0].id;
                            newfile.thumbnail = retVal[0].thumbnail;
                            newfile.user_id = retVal[0].user_id;
                            newfile.user_name = retVal[0].user_name;
                            delete (newfile.uploadprogress);

                            retSub.next({files: retVal});
                            retSub.complete();
                        } catch (e) {
                            resp = {
                                status: "error",
                                data: "Unknown error occurred: [" + request.responseText + "]"
                            };
                        }
                    }
                };

                request.upload.addEventListener("progress", e => {
                    newfile.uploadprogress = Math.round(e.loaded / e.total * 100);
                    retSub.next({progress: {total: e.total, loaded: e.loaded}});
                }, false);

                request.open("POST", this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment", true);
                request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                let fileBody = {
                    file: file.filecontent,
                    filename: file.name,
                    filemimetype: file.type
                };

                request.send(JSON.stringify(fileBody));
            });
        }

        return retSub.asObservable();
    }

    private readFile(file): Observable<any> {
        let responseSubject = new Subject<any>();
        let reader = new FileReader();
        reader['file'] = file;
        reader.onloadend = (e) => {
            let filecontent = reader.result.toString();
            filecontent = filecontent.substring(filecontent.indexOf('base64,') + 7);

            let file = reader['file'];
            file.filecontent = filecontent;
            responseSubject.next(file);
            responseSubject.complete();
        };
        reader.readAsDataURL(file);
        return responseSubject.asObservable();
    }

    public deleteAttachment(id) {
        this.backend.deleteRequest("module/" + this.module + "/" + this.id + "/attachment/" + id)
            .subscribe(res => {
                this.files.some((item, index) => {
                    if (item.id == id) {
                        this.files.splice(index, 1);
                        return true;
                    }
                });
            });
    }


    public downloadAttachment(id, name?) {
        this.backend.getRequest("/module/" + this.module + "/" + this.id + "/attachment/" + id).subscribe(fileData => {
            let blob = this.b64toBlob(fileData.file, fileData.file_mime_type);
            let blobUrl = URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = blobUrl;
            a.download = fileData.filename;
            a.click();
            a.remove();
        });
    }

    public getAttachment(id): Observable<any> {
        let retSubject = new Subject();

        this.backend.getRequest("/module/" + this.module + "/" + this.id + "/attachment/" + id).subscribe(fileData => {
            retSubject.next(fileData.file);
            retSubject.complete();
        });

        return retSubject.asObservable();
    }

    private b64toBlob(b64Data, contentType = '', sliceSize = 512) {

        let byteCharacters = atob(b64Data);
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    public openAttachment(id, name?) {
        /*let params: Array<string> = [];
        params.push("sessionid=" + this.session.authData.sessionId);
        window.open(
            this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment/" + id + "/download?" + params.join("&"),
            "_blank" // <- open in a new window
        );*/
        this.backend.getRequest("/module/" + this.module + "/" + this.id + "/attachment/" + id).subscribe(fileData => {
            let blob = this.b64toBlob(fileData.file, fileData.file_mime_type);
            let blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank");
        });
    }

    public resetData() {
        this.items = [];
    }
}
