import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Subject, Observable} from "rxjs";

import {configurationService} from "./configuration.service";
import {session} from "./session.service";
import {backend} from "./backend.service";

@Injectable()
export class modelattachments {
    public module: string = "";
    public id: string = "";
    public items: any = [];
    public count: number = 0;
    public files: Array<any> = [];

    private serviceSubscriptions: Array<any> = [];

    constructor(
        private http: HttpClient,
        private backend: backend,
        private configurationService: configurationService,
        private session: session,
    ) {
    }

    public getAttachments() {
        this.backend.getRequest("module/" + this.module + "/" + this.id + "/attachment/ui").subscribe(response => {
            this.resetData();
            this.files = response;
        });
    }

    public uploadAttachments(files): Observable<any> {
        if (files.length === 0) {
            return;
        }

        let retSub = new Subject<any>();

        let params: Array<string> = [];
        // params.push("sessionid=" + this.session.authData.sessionId);

        let data = new FormData();
        data.append("file", files[0], files[0].name);

        let request = new XMLHttpRequest();
        let resp: any = {};
        request.onreadystatechange = function (scope: any = this) {
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

        request.upload.addEventListener("progress", function (e: any) {
            retSub.next({progress: {total: e.total, loaded: e.loaded}});
            // console.log("progress" + e.loaded + "/" + e.total + "=" + Math.ceil(e.loaded/e.total) * 100 + "%");
        }, false);

        request.open("POST", this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment/ui?" + params.join("&"), true);
        request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
        request.send(data);

        return retSub.asObservable();
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
        let params: Array<string> = [];
        params.push("sessionid=" + this.session.authData.sessionId);

        this.backend.downloadFile(
            {
                route: "/module/" + this.module + "/" + this.id + "/attachment/" + id + "/download"
            }, name
        );

    }

    public openAttachment(id, name?) {
        let params: Array<string> = [];
        params.push("sessionid=" + this.session.authData.sessionId);
        window.open(
            this.configurationService.getBackendUrl() + "/module/" + this.module + "/" + this.id + "/attachment/" + id + "/download?" + params.join("&"),
            "_blank" // <- open in a new window
        );
    }

    public resetData() {
        this.items = [];
    }
}
