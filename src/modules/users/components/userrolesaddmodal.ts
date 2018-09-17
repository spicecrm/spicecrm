import {Component, Input} from "@angular/core";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {Observable, Subject} from "rxjs";
import {metadata} from "../../../services/metadata.service";

declare var moment: any;

@Component({
    selector: "user-roles-add-modal",
    templateUrl: "./src/modules/users/templates/userrolesaddmodal.html",
    providers: [model, view]
})
export class UserRolesAddModal {

    @Input() public user_id = "";
    @Input() public noneUserRoles: Array<any> = [];
    private selectedRoles: Array<any> = [];
    private sysuirole_id: string = "";
    private self: any;
    private response: Observable<object> = null;
    private responseSubject: Subject<any> = null;


    constructor(
        private language: language,
        private model: model,
        private modelutilities: modelutilities,
        private toast: toast,
        private backend: backend,
        private view: view,
        private metadata: metadata,
    ) {
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
    }

    private setSelectedRole(roleIndex, role) {
        this.noneUserRoles.splice(roleIndex, 1);
        this.selectedRoles.push(role);
    }

    private removeSelectedRole(roleIndex, role) {
        this.selectedRoles.splice(roleIndex, 1);
        this.noneUserRoles.push(role);
    }

    private setRole(id) {
        this.sysuirole_id = id;
    }

    private cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    private onModalEscX() {
        this.cancel();
    }

    private add() {
        if (this.sysuirole_id.length == 0) {
            this.toast.sendToast(this.language.getLabel("LBL_MAKE_SELECTION"));
            return false;
        }

        this.backend.postRequest(`/spiceui/core/roles/${this.sysuirole_id}/${this.user_id}/new`)
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
                    console.log(error);
                    this.self.destroy();
                });
    }
}