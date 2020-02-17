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
