/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {broadcast} from "../../../services/broadcast.service";

@Component({
    selector: "user-signature",
    templateUrl: "../templates/usersignature.html",
    providers: [view]
})
export class UserSignature {

    public preferences: any = {};

    constructor(public backend: backend,public view: view, public broadcast: broadcast) {

    }
}
