/**
 * @module GlobalComponents
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/**
 * renders a dialog to change the password or to generate a TOTP authentication when the user logs in and is required to do this
 */
@Component({
    selector: 'global-login-change-password',
    templateUrl: '../templates/globalloginchangepassword.html'
})
export class GlobalLoginChangePassword {

    /**
     * What should this component do? Password renewal or generation of the TOTP authentication?
     * @public
     */
    @Input() public case: 'totp'|'pwd';

    /**
     * the old password to check that the password has been changed
     * @public
     */
    @Input('password') public password: string;

    /**
     * the id ot the user that tried to log in
     * @public
     */
    @Input('username') public username: string;

    /**
     * emits if the prompt should be closed again
     * @public
     */
    @Output() public closeDialog = new EventEmitter<string>();

    /**
     * the entered password
     * @public
     */
    public newPassword: string;

    /**
     * the repeated password
     * @public
     */
    public repeatPassword: string;

    /**
     * the regex to match the password requirements
     * @public
     */
    public pwdCheck: RegExp = new RegExp('//');

    /**
     * the text for the password requriements
     * @public
     */
    public pwdGuideline: string;

    /**
     * if we are posting the password or the TOTP code
     * @public
     */
    public isPosting = false;

    /**
     * the base 64 encoded QR code for TOTP
     * @public
     */
    public totpQRCode: string;

    /**
     * the TOTP secret generated
     * @public
     */
    public secret: string;

    /**
     * TOTP name of the user
     * @public
     */
    public totpName: string;

    /**
     * the TOTP code entered to validate
     * @public
     */
    public totpCode = '';

    /**
     * The array with the specific labels needed by the dialog, provided by the exception of the backend
     */
    @Input() public labels: any[];

    /**
     * Indicates loading of backend data.
     */
    public isLoading = false;

    /**
     * ID of the last error toast.
     * @private
     */
    private toastErrorID;

    public subscriptions: Subscription = new Subscription();

    constructor(public loginService: loginService,
               public http: HttpClient,
               public configuration: configurationService,
               public toast: toast,
               public session: session,
               public language: language
    ) {}

    public ngOnInit() {

        if ( this.case === 'totp') {

            this.isLoading = true;
            let headers = new HttpHeaders();
            headers = headers.set('Accept', 'application/json');
            this.subscriptions.add(
                this.http.post( this.configuration.getBackendUrl() + `/authentication/totp/generate`, {
                    username: this.username,
                    password: this.password
                }, { headers } )
                    .pipe( take( 1 ) )
                    .subscribe( {
                        next: ( res: any ) => {
                            if ( res.secret ) {
                                this.totpQRCode = 'data:image/png;base64,' + res.qrcode;
                                this.secret = res.secret;
                                this.totpName = res.name;
                            } else {
                                this.toast.sendToast( 'Error generating Code', 'error' );
                                this.close();
                            }
                            this.isLoading = false;
                        },
                        error: () => {
                            this.toast.sendToast( 'Error generating Code', 'error' );
                            this.close();
                            this.isLoading = false;
                        }
                    })
            );

        } else {
            this.buildGuidelineText();
        }
    }

    /**
     * checks that the new passoword is different than the old
     */
    get oldPwError() {
        return (this.password == this.newPassword) ? this.getLabel('MSG_OLD_PWD_NOT_AS_NEW') : false;
        // 'Old password is not allowed to be used as a new password'
    }

    /**
     * check that the password matches the requirements
     */
    get pwderror() {
        return this.newPassword && !this.pwdCheck.test(this.newPassword) ? this.getLabel('MSG_PWD_NOT_LEGAL') : false;
    }

    /**
     * checks that the new password has been typed correctly
     */
    get pwdreperror() {
        return this.newPassword == this.repeatPassword ? false : this.getLabel('MSG_PWDS_DONT_MATCH'); // does not match password
    }

    /**
     * closes the dialog
     * @param password
     */
    public close( password?: string) {
        this.closeDialog.emit(password);
    }

    /*
    * build password guideline text
    */
   public buildGuidelineText() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp(extConf.regex);

        let requArray = [];

        if (extConf.onelower) requArray.push( this.getLabel('LBL_ONE_LOWERCASE'));
        if (extConf.oneupper) requArray.push( this.getLabel('LBL_ONE_UPPERCASE'));
        if (extConf.onenumber) requArray.push( this.getLabel('LBL_ONE_DIGIT'));
        if (extConf.onespecial) requArray.push( this.getLabel('LBL_ONE_SPECIALCHAR'));
        if (extConf.minpwdlength) requArray.push( this.getLabel('LBL_MIN_LENGTH') + ' ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');
    }

    /**
     * checks if the password can be saved
     */
    get canSavePwd() {
        return this.newPassword && this.oldPwError == false && this.pwderror == false && this.pwdreperror == false && !this.isPosting;
    }

    /**
     * checks if the TOTP code can be sent
     */
    get canSaveTOTP() {
        return !this.isPosting && this.totpCode.length === 6;
    }

    /**
     * change the password for the user
     * send an unauthenticated request to the backend
     */
   public setPassword() {
        if (this.canSavePwd) {
            this.isPosting = true;
            this.subscriptions.add(
                this.http.post(this.configuration.getBackendUrl() + '/authentication/changepassword', {
                        username: this.username,
                        password: this.password,
                        newPassword: this.newPassword
                    })
                    .pipe(take(1))
                    .subscribe( {
                        next: ( res ) => {
                            this.toast.sendToast( this.getLabel( 'MSG_PWD_CHANGED_SUCCESSFULLY' ), 'success', '', 5 );
                            this.close( this.newPassword );
                        },
                        error: ( err: any ) => {
                            this.isPosting = false;
                        }
                    })
            );
        }
    }

    /**
     * Post the TOTP code to the backend.
     */
    public saveTOTP() {
        let headers = new HttpHeaders();
        if ( this.toastErrorID ) {
            this.toast.clearToast( this.toastErrorID );
            this.toastErrorID = null;
        }
        this.isPosting = true;
        this.subscriptions.add(
            this.http.put( this.configuration.getBackendUrl() + `/authentication/totp/validate/${this.totpCode}`, {
                username: this.username,
                password: this.password
            },{ headers })
            .pipe(take(1))
            .subscribe( {
                next: ( res: any ) => {
                    this.isPosting = false;
                    if( res.validated ) {
                        this.close();
                    } else {
                        this.toastErrorID = this.toast.sendToast('Error validating your code', 'error', 'The code you entered is not valid, please try again. If you entered the code correctly, make sure your computer\'s time is set correctly.', false, 'asdfasdf' );
                    }
                    this.totpCode = '';
                },
                error: () => {
                    this.isPosting = false;
                    this.toastErrorID = this.toast.sendToast('Error validating your code', 'error', 'There as an internal error validating your request.', false );
                    this.totpCode = '';
                }
            })
        );
    }

    /**
     * Retrieve a specific label.
     * @param name Label Name
     * @param type Label Type ('default', 'short' or 'long')
     */
    public getLabel( name: string, type: 'default'|'short'|'long' = 'default') {
       return this.labels && this.labels[name] && this.labels[name][type] ? this.labels[name][type] : name;
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
