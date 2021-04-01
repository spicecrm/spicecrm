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
 * @module ModuleContacts
 */
import {Component, OnInit} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {toast} from '../../../services/toast.service';

@Component({
    selector: "contact-portal-details",
    templateUrl: "./src/modules/contacts/templates/contactportaldetails.html"
})
export class ContactPortalDetails implements OnInit {

    private loaded: boolean = false;

    private user = {
        active: false,
        id: '',
        aclRole: '',
        portalRole: '',
        password: '',
        name: '',
        setDateTimePrefsWithSystemDefaults: true
    };

    private pwdGuideline: string = "";
    private pwdCheckRegex: RegExp = new RegExp("//");

    private aclRoles = [];
    private portalRoles = [];
    private self: any = undefined;

    private usernameAlreadyExists = false;
    private usernameTesting = false;

    private lastToast;

    private isSaving = false;

    constructor( private lang: language, private backend: backend, private metadata: metadata, private model: model, private toast: toast ) { }

    public ngOnInit() {
        // check data from the backend
        this.backend.getRequest("portal/" + this.model.id + "/portalaccess", { lang: this.lang.currentlanguage } ).subscribe((userdata: any) => {

            this.aclRoles = userdata.aclRoles;
            this.portalRoles = userdata.portalRoles;

            if ( userdata.user && userdata.user.id ) {
                this.user.active = userdata.user.status;
                this.user.id = userdata.user.id;
                this.user.aclRole = userdata.user.aclRole;
                this.user.portalRole = userdata.user.portalRole;
                this.user.setDateTimePrefsWithSystemDefaults = false;
            }

            if ( !this.user.id ) {
                this.aclRoles.some( (v) => {
                    if ( v.name === 'Portal') {
                        this.user.aclRole = v.id;
                        return true;
                    }
                });
                this.portalRoles.some( (v) => {
                    if ( v.name === 'Portal') {
                        this.user.portalRole = v.id;
                        return true;
                    }
                });
            }

            this.pwdGuideline = userdata.pwdCheck.guideline;
            this.pwdCheckRegex = new RegExp( userdata.pwdCheck.regex );

            if ( this.user.id ) {
                this.user.name = userdata.user.username;
                this.loaded = true;
            } else {
                this.user.name = this.model.data.email1 ? this.model.data.email1 : this.model.data.email_address_private;
                this.testUsername();
            }

        });
    }

    private testUsername() {
        if ( this.user.name ) {
            this.usernameTesting = true;
            this.backend.getRequest( "portal/" + this.model.id + "/testUsername", { username: this.user.name } ).subscribe( ( data ) => {
                if ( !data.error ) {
                    this.usernameAlreadyExists = data.exists;
                    this.loaded = true;
                    this.usernameTesting = false;
                }
            });
        }
    }

    get pwdError() {
        if ( !this.loaded ) { return false; }
        return !this.user.password || this.pwdCheckRegex.test( this.user.password ) ? false : this.lang.getLabel("MSG_PWD_NOT_LEGAL");
    }

    private closeModal() {
        this.self.destroy();
    }

    get isNewUser() {
        return this.loaded && this.user.id == "";
    }

    get canSave() {
        if ( this.isSaving ) return false;
        if ( this.usernameTesting ) return false;
        if ( !this.user.name || !this.user.portalRole || !this.user.aclRole ) return false;
        if ( this.usernameAlreadyExists ) return false;
        if ( this.isNewUser ) {
            if ( !this.user.password || this.pwdError ) return false;
        } else {
            if ( this.pwdError ) return false;
        }
        return true;
    }

    private save() {
        if ( this.canSave ) {
            this.isSaving = true;
            let body = {
                status: this.user.active,
                aclRole: this.user.aclRole,
                portalRole: this.user.portalRole,
                username: this.user.name,
                password: this.user.password,
                setDateTimePrefsWithSystemDefaults: this.user.setDateTimePrefsWithSystemDefaults
            };
            this.toast.clearToast( this.lastToast );
            this.backend.postRequest( "portal/" + this.model.id + "/portalaccess/" + ( this.isNewUser ? 'create':'update' ), {}, body ).subscribe( ( response: any ) => {
                if ( response.success ) {
                    this.lastToast= this.toast.sendToast( 'Portal user '+ ( response.type === 'new' ? 'created':'edited' ) + ' successfully.', 'success' );
                }
                this.closeModal();
            }, ( errorResponse ) => {
                this.lastToast = this.toast.sendToast( 'Error saving data of portal user.', 'error', errorResponse.error.error.message, false );
                this.isSaving = false;
            });
        }
    }
}
