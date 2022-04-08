/**
 * @module GlobalComponents
 */
import {
    Component, EventEmitter, Output
} from '@angular/core';
import {loginService} from '../../services/login.service';
import {session} from '../../services/session.service';

/**
 * a modal to prompt the user for the password to relogin
 * this is rendered when an http request fails because the session is expired
 * it prompts the user to relogin with the current logged in user and the current login method
 */
@Component({
    selector: 'global-re-login',
    templateUrl: '../templates/globalrelogin.html',
})
export class GlobalReLogin {

    /**
     * reference to the modal itself
     *
     * @private
     */
   public self: any;

    /**
     * the password for the user
     *
     * @private
     */
   public password: string;

    /**
     * emits if the user logged in successfully
     *
     * @private
     */
    @Output()public loggedin: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * indicator that a relogin is running
     *
     * @private
     */
   public loggingIn: boolean = false;

    constructor(public login: loginService,public session: session) {
    }

   public tokenLogin(token) {
        this.loggingIn = true;
        this.login.relogin(null, token).subscribe(
            res => {
                this.loggedin.emit(true);
                this.close();
            },
            error => {
                this.loggingIn = false;
            }
        );
    }

   public relogin() {
        this.loggingIn = true;
        this.login.relogin(this.password, null).subscribe(
            res => {
                this.loggedin.emit(true);
                this.close();
            },
            error => {
                this.loggingIn = false;
            }
        );
    }

    /**
     * cleans the session and renavigates to the login screen
     *
     * @private
     */
   public logout() {
        this.login.logout(true);
        this.close();
    }

    /**
     * closes the modal
     * @private
     */
   public close() {
        this.self.destroy();
    }
}
