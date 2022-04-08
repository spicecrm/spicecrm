/**
 * @module GlobalComponents
 */
import {
    Component, EventEmitter, OnDestroy, OnInit, Output
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {configurationService} from '../../services/configuration.service';
import {loginService} from '../../services/login.service';
import {interval, Subscription} from "rxjs";

/**
 * a modal to prompt the user for the password to reconnect
 * this is rendered when an http request is failing
 * it tries to reconnect in 5 seconds interval
 */
@Component({
    selector: 'global-re-connect',
    templateUrl: '../templates/globalreconnect.html',
})
export class GlobalReConnect implements OnInit, OnDestroy {

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
    @Output()public connected: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * a timer to the reconnect check
     * @private
     */
   public timeToNextCheck: number = 1000;

    /**
     * the subscription to countdown the time
     *
     * @private
     */
   public timerSubscription: Subscription;

    constructor(public http: HttpClient,public configuration: configurationService,public login: loginService) {

    }

    /**
     * initialize the next check
     */
    public ngOnInit() {
        this.timerSubscription = interval(10).subscribe(x => {
            this.timeToNextCheck--;
            this.checkReconnect();
        });
    }

    /**
     * unsubscribe
     */
    public ngOnDestroy() {
        this.timerSubscription.unsubscribe();
    }

    /**
     * check if we shoudl check for reconnection
     *
     * @private
     */
   public checkReconnect() {
        if (this.timeToNextCheck == 0) {
            this.reconnect();
        }
    }

    get progress() {
        return this.timeToNextCheck / 10;
    }

    /**
     * checks the reconnect calling sysinfo
     * if successful the modal is closed if not the timer is reset
     *
     * @private
     */
   public reconnect() {
        let loginUrl: string = this.configuration.getBackendUrl() + '/sysinfo';
        this.http.get(loginUrl).subscribe(
            (res: any) => {
                this.connected.emit(true);
                this.close();
            },
            (err: any) => {
                console.log(err);
                this.timeToNextCheck = 1000;
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
