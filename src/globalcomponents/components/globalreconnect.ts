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
    templateUrl: './src/globalcomponents/templates/globalreconnect.html',
})
export class GlobalReConnect implements OnInit, OnDestroy {

    /**
     * reference to the modal itself
     *
     * @private
     */
    private self: any;

    /**
     * the password for the user
     *
     * @private
     */
    private password: string;

    /**
     * emits if the user logged in successfully
     *
     * @private
     */
    @Output() private connected: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * a timer to the reconnect check
     * @private
     */
    private timeToNextCheck: number = 1000;

    /**
     * the subscription to countdown the time
     *
     * @private
     */
    private timerSubscription: Subscription;

    constructor(private http: HttpClient, private configuration: configurationService, private login: loginService) {

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
    private checkReconnect() {
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
    private reconnect() {
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
    private logout() {
        this.login.logout(true);
        this.close();
    }

    /**
     * closes the modal
     * @private
     */
    private close() {
        this.self.destroy();
    }
}
