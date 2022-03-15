/**
 * @module ModuleUsers
 */
import {Component, Input} from "@angular/core";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {Observable, Subject} from "rxjs";

@Component({
    selector: "user-roles-add-modal",
    templateUrl: "../templates/userrolesaddmodal.html"
})
export class UserRolesAddModal {

    @Input() public user_id = '';
    @Input() public noneUserRoles: any[] = [];
    public sysuirole_id = '';
    public self: any;
    public response: Observable<object> = null;
    public responseSubject: Subject<any> = null;


    constructor(
        public language: language,
        public toast: toast,
        public backend: backend
    ) {
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
    }

    get nonUserGlobalRoles(): any[] {
        let globalRoles = [];
        this.noneUserRoles.forEach( role => {
            if ( !role.custom ) globalRoles.push( role );
        });
        return globalRoles;
    }

    get nonUserCustomRoles(): any[] {
        let customRoles = [];
        this.noneUserRoles.forEach( role => {
            if ( role.custom ) customRoles.push( role );
        });
        return customRoles;
    }

    public setRole(id) {
        this.sysuirole_id = id;
    }

    public cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    public onModalEscX() {
        this.cancel();
    }

    public canSubmit(): boolean {
        return this.sysuirole_id.length > 0;
    }

    public add() {
        this.backend.postRequest(`configuration/spiceui/core/roles/${this.sysuirole_id}/${this.user_id}/new`)
            .subscribe(
                res => {
                    if (res.status == "error") {
                        this.toast.sendToast(res.message, "error");
                        this.responseSubject.complete();
                        this.self.destroy();
                    }
                    let newRole;
                    this.noneUserRoles.every(role => {
                        if(role.id == this.sysuirole_id)
                            newRole = role;
                        return true;
                    });
                    this.responseSubject.next(newRole);
                    this.responseSubject.next(this.sysuirole_id);
                    this.responseSubject.complete();
                    this.self.destroy();
                    this.toast.sendToast(this.language.getLabel("MSG_SUCCESSFULLY_ADDED"), "success");
                },
                error => {
                    this.toast.sendToast("Error, try again later", "error");
                    this.self.destroy();
                });
    }
}
