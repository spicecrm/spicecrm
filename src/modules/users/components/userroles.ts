/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {session} from "../../../services/session.service";

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: "user-roles",
    templateUrl: "./src/modules/users/templates/userroles.html"
})
export class UserRoles {

    private userRoles: any[] = [];
    private noneUserRoles: any[] = [];
    private componentId: string;

    constructor(
        private backend: backend,
        private toast: toast,
        private modal: modal,
        private model: model,
        private session: session,
        private language: language) {

        this.componentId = _.uniqueId();

        this.backend.getRequest("spiceui/core/roles/" + this.model.id).subscribe(res => {
            this.userRoles = res.allRoles.filter(role => {
                for (let userRole of res.userRoles) {
                    if (role.id == userRole.sysuirole_id) {
                        role.defaultrole = userRole.defaultrole;
                        return true;
                    }
                }
                return false;
            });
            this.userRoles = this.sortRoles( this.userRoles );

            this.noneUserRoles = res.allRoles.filter(role => {
                for (let userRole of this.userRoles) {
                    if (role.id == userRole.id)
                        return false;
                }
                return true;
            });
            this.noneUserRoles = this.sortRoles( this.noneUserRoles );

            this.noneUserRoles.map(noneUserRole => noneUserRole.defaultrole = "0");
        });
    }

    private sortRoles( roles ): any[] {
        return roles.sort( ( a, b ) => {
            return this.language.getLabel( a.label ).localeCompare( this.language.getLabel( b.label ));
        });
    }

    private addRole(event) {
        if (this.session.authData.admin) {
            this.modal.openModal("UserRolesAddModal").subscribe(addModalRef => {
                addModalRef.instance.user_id = this.model.data.id;
                addModalRef.instance.noneUserRoles = this.noneUserRoles;
                addModalRef.instance.response.subscribe(res => {
                    if (res && typeof res === "object") {
                        this.userRoles.push(res);
                        if (this.userRoles.length === 1) {
                            this.setDefaultRole(res.id);
                        }
                        this.userRoles = this.sortRoles( this.userRoles );
                    }
                    if (res && typeof res === "string") {
                        this.noneUserRoles = this.noneUserRoles.filter(role => role.id != res);
                    }
                });
            });
        }
    }

    private deleteRole(roleIndex, roleId, isDefaultRole) {
        if (this.session.authData.admin && !isDefaultRole) {
            this.modal.confirm(
                this.language.getLabel("MSG_DELETE_RECORD", "", "long"),
                this.language.getLabel("MSG_DELETE_RECORD"))
                .subscribe((answer) => {
                    if (answer) {
                        this.backend.deleteRequest(`spiceui/core/roles/${roleId}/${this.model.data.id}`)
                            .subscribe(
                                res => {
                                    if (res.status == "error") {
                                        this.toast.sendToast(res.message, "error");
                                        return false;
                                    }
                                    let deletedRole = this.userRoles.splice(roleIndex, 1);
                                    this.noneUserRoles.push(deletedRole[0]);
                                    this.noneUserRoles = this.sortRoles( this.noneUserRoles );
                                    this.toast.sendToast(this.language.getLabel("MSG_SUCCESSFULLY_DELETED"), "success");
                                },
                                err => this.toast.sendToast(this.language.getLabel("ERR_CANT_DELETE"), "error"));
                    }
                });
        }

    }

    private setDefaultRole(roleId) {
        if (this.session.authData.admin) {
            this.userRoles.every(role => {
                (role.id == roleId) ? role.defaultrole = "1" : role.defaultrole = "0";
                return true;
            });
            this.backend.postRequest(`spiceui/core/roles/${roleId}/${this.model.data.id}/default`);
        }
    }
}
