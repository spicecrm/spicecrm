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

/**
 * renders a tab in the users details vie that allows admins to manage roles for a given user
 */
@Component({
    selector: "user-roles",
    templateUrl: "./src/modules/users/templates/userroles.html"
})
export class UserRoles {

    private userRoles: any[] = [];
    private noneUserRoles: any[] = [];
    private componentId: string;

    /**
     * inidcates that the roles are being laoded
     */
    private loading: boolean = true;

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

            // set loading to false
            this.loading = false;
        });
    }

    /**
     * sort the roles
     *
     * @param roles
     */
    private sortRoles( roles ): any[] {
        if(roles) {
            return roles.sort((a, b) => {
                return this.language.getLabel(a.label).localeCompare(this.language.getLabel(b.label));
            });
        }
        return [];
    }

    /**
     * adds a role to the user
     *
     * @param event
     */
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

    /**
     * removes a role from the user
     *
     * @param roleIndex
     * @param roleId
     * @param isDefaultRole
     */
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

    /**
     * set one role as defulat role for the user
     *
     * @param roleId
     */
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
