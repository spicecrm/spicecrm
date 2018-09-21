import {Component, Input, HostBinding, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";

@Component({
    selector: "contact-portal-details",
    templateUrl: "./src/modules/contacts/templates/contactportaldetails.html"
    /*
     host: {
     "(document:keydown)": "this.keypressed($event)",
     "(document:keyup)": "this.keypressed($event)"
     }
     */
})
export class ContactPortalDetails implements OnInit {

    private loaded: boolean = false;

    private useractive: boolean = false;
    private userid: string = "";
    private useraclrole: string = "";
    private userportalrole: string = "";
    private userpassword: string = "";
    private username: string = "";

    private pwdGuideline: string = "";
    private pwdCheckRegex: RegExp = new RegExp("//");

    private aclroles: Array<any> = [];
    private portalroles: Array<any> = [];
    private self: any = undefined;

    private usernameAlreadyExists = false;
    private usernameTesting = false;

    constructor(private lang: language, private backend: backend, private metadata: metadata, private model: model) { }

    public ngOnInit() {
        // check data from the backend
        this.backend.getRequest("portal/" + this.model.id + "/portalaccess", { lang: this.lang.currentlanguage } ).subscribe((userdata: any) => {

            if ( userdata.user && userdata.user.id ) {
                this.useractive = userdata.user.status;
                this.userid = userdata.user.id;
                this.useraclrole = userdata.user.aclrole;
                this.userportalrole = userdata.user.portalrole;
            }

            this.pwdGuideline = userdata.pwdCheck.guideline;
            this.pwdCheckRegex = new RegExp( userdata.pwdCheck.regex );

            this.aclroles = userdata.aclroles;
            this.portalroles = userdata.portalroles;

            if (this.userid && this.userid != "") {
                this.username = userdata.user.username;
                this.loaded = true;
            } else {
                this.username = this.model.data.email1 ? this.model.data.email1 : this.model.data.email_address_private;
                this.testUsername();
            }

        });
    }

    private testUsername() {
        if ( this.username ) {
            this.usernameTesting = true;
            this.backend.getRequest( "portal/" + this.model.id + "/testUsername", { username: this.username } ).subscribe( ( data ) => {
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
        return !this.userpassword || this.pwdCheckRegex.test( this.userpassword ) ? false : this.lang.getLabel("MSG_PWD_NOT_LEGAL");
    }

    private closeModal() {
        this.self.destroy();
    }

    get isNewUser() {
        return this.loaded && this.userid == "";
    }

    get canSave() {
        if ( this.usernameTesting ) {
            return false;
        }

        if ( this.usernameAlreadyExists ){
            return false;
        }
        if ( this.isNewUser ) {
            if ( this.userpassword.length === 0 || this.pwdError ){ return false;}
        } else {
            if ( this.pwdError ) { return false;}
        }
        return true;
    }

    private save() {
        if( this.canSave ) {
            let body = {
                status: this.useractive,
                aclrole: this.useraclrole,
                portalrole: this.userportalrole,
                username: this.username,
                password: this.userpassword
            };
            this.backend.postRequest( "portal/" + this.model.id + "/portalaccess", {}, body ).subscribe( ( userdata: any ) => {
                this.closeModal();
            });
        }
    }
}