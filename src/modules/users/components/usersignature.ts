import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {broadcast} from "../../../services/broadcast.service";

@Component({
    selector: "user-signature",
    templateUrl: "./src/modules/users/templates/usersignature.html",
    providers: [view]
})
export class UserSignature {

    private preferences: any = {};

    constructor(private backend: backend,private view: view, private broadcast: broadcast) {

    }
}
