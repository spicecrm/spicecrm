/**
 * @module ModuleContacts
 */
import {Component, OnInit} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {toast} from '../../../services/toast.service';
import { configurationService } from '../../../services/configuration.service';
import { take } from 'rxjs/operators';

@Component({
    selector: "contact-portal-details",
    templateUrl: "../templates/contactportaldetails.html"
})
export class ContactPortalDetails implements OnInit {

    public loaded: boolean = false;

    public user = {
        active: false,
        id: '',
        aclRole: '',
        aclProfile: '',
        portalRole: '',
        password: '',
        name: '',
        setDateTimePrefsWithSystemDefaults: true
    };

    public pwdGuideline = '';

    /**
     * a regex for the password check that is built from the password requirements
     * @private
     */
    public pwdCheckRegex: RegExp = new RegExp("//");


    public aclRoles = []; // empty array means: no acl roles, new acl system is used
    public aclProfiles = []; // empty array means: no acl profiles, old acl system is used
    public portalRoles = [];
    public defaultPortalUserProfile: string;
    public self: any = undefined;

    public usernameAlreadyExists = false;
    public usernameTesting = false;

    public lastToast;

    public isSaving = false;

    constructor( public language: language, public backend: backend, public metadata: metadata, public model: model, public toast: toast, public configuration: configurationService ) { }

    public ngOnInit() {

        this.getInfo();

        // check data from the backend
        this.backend.getRequest('module/Contacts/' + this.model.id + '/portalAccess')
            .pipe(take(1)).subscribe((userdata: any) => {

            if ( userdata.aclRoles ) this.aclRoles = userdata.aclRoles;
            if ( userdata.aclProfiles ) this.aclProfiles = userdata.aclProfiles;
            if ( userdata.defaultPortalUserProfile ) this.defaultPortalUserProfile = userdata.defaultPortalUserProfile;

            this.portalRoles = userdata.portalRoles;

            if ( userdata.user && userdata.user.id ) {
                this.user.active = userdata.user.status;
                this.user.id = userdata.user.id;
                if ( userdata.user.aclRole ) this.user.aclRole = userdata.user.aclRole;
                if ( userdata.user.aclProfile ) this.user.aclProfile = userdata.user.aclProfile;
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

            if ( this.user.id ) {
                this.user.name = userdata.user.username;
                this.loaded = true;
            } else {
                this.user.name = this.model.getField('email1') ? this.model.getField('email1') : this.model.getField('email_address_private');
                this.testUsername();
                if ( this.aclProfiles.length === 1 ) this.user.aclProfile = this.aclProfiles[0].id;
                else if ( this.defaultPortalUserProfile ) this.user.aclProfile = this.defaultPortalUserProfile;
            }

        });
    }

    public testUsername() {
        if ( this.user.name ) {
            this.usernameTesting = true;
            this.backend.getRequest('module/Contacts/'+this.model.id+'/testUsername', { username: this.user.name } )
                .pipe(take(1)).subscribe( ( data ) => {
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
        return !this.user.password || this.pwdCheckRegex.test( this.user.password ) ? false : this.language.getLabel("MSG_PWD_NOT_LEGAL");
    }

    public closeModal() {
        this.self.destroy();
    }

    get isNewUser() {
        return this.loaded && this.user.id == "";
    }

    get canSave() {
        if ( this.isSaving ) return false;
        if ( this.usernameTesting ) return false;
        if ( !this.user.name || !this.user.portalRole || ( !this.user.aclRole && this.aclRoles.length ) || ( !this.user.aclProfile && this.aclProfiles.length )) return false;
        if ( this.usernameAlreadyExists ) return false;
        if ( this.isNewUser ) {
            if ( !this.user.password || this.pwdError ) return false;
        } else {
            if ( this.pwdError ) return false;
        }
        return true;
    }

    public save() {
        if ( this.canSave ) {
            this.isSaving = true;
            let body = {
                status: this.user.active,
                aclRole: this.aclRoles.length ? this.user.aclRole : undefined,
                aclProfile: this.aclProfiles.length ? this.user.aclProfile : undefined,
                portalRole: this.user.portalRole,
                username: this.user.name,
                password: this.user.password,
                setDateTimePrefsWithSystemDefaults: this.user.setDateTimePrefsWithSystemDefaults
            };
            this.toast.clearToast( this.lastToast );
            if ( this.isNewUser ) {
                this.backend.postRequest( "module/Contacts/" + this.model.id + "/portalAccess", {}, body )
                    .pipe(take(1)).subscribe( ( response: any ) => {
                    if( response.success ) {
                        this.lastToast = this.toast.sendToast( 'Portal user created successfully.', 'success' );
                    }
                    this.closeModal();
                }, ( errorResponse ) => {
                    this.lastToast = this.toast.sendToast( 'Error saving data of portal user.', 'error', errorResponse.error.error.message, false );
                    this.isSaving = false;
                } );
            } else {
                this.backend.putRequest( "module/Contacts/" + this.model.id + "/portalAccess", {}, body )
                    .pipe(take(1)).subscribe( ( response: any ) => {
                    if( response.success ) {
                        this.lastToast = this.toast.sendToast( 'Portal user edited successfully.', 'success' );
                    }
                    this.closeModal();
                }, ( errorResponse ) => {
                    this.lastToast = this.toast.sendToast( 'Error saving data of portal user.', 'error', errorResponse.error.error.message, false );
                    this.isSaving = false;
                } );
            }
        }
    }

    /**
     * fetches and builds the guideline for passwords
     *
     * @private
     */
    public getInfo() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheckRegex = new RegExp(extConf.regex);

        let requArray = [];
        if (extConf.onelower) requArray.push(this.language.getLabel('MSG_PASSWORD_ONELOWER'));
        if (extConf.oneupper) requArray.push(this.language.getLabel('MSG_PASSWORD_ONEUPPER'));
        if (extConf.onenumber) requArray.push(this.language.getLabel('MSG_PASSWORD_ONENUMBER'));
        if (extConf.onespecial) requArray.push(this.language.getLabel('MSG_PASSWORD_ONESPECIAL'));
        if (extConf.minpwdlength) requArray.push(this.language.getLabel('MSG_PASSWORD_LENGTH') + ' ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');
    }

}
