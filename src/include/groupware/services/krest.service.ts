import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {configuration} from "./configuration.service";

@Injectable()
export class Krest {

    protected emailId: string = "";

    public attachmentToken: any;
    public ewsUrl: any;

    constructor(
        private http: HttpClient,
        private configuration: configuration,
    ) {}
}
