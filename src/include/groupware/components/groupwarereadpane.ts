import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
// import AsyncResultStatus = Office.AsyncResultStatus;
import {Subject, Observable} from 'rxjs';
import {Router} from '@angular/router';

import {configuration} from '../services/configuration.service';
import {GroupwareService} from '../services/groupware.service';
import {backend} from "../../../services/backend.service";

// declare var Office: any;

@Component({
    selector: 'groupware-read-pane',
    templateUrl: './src/include/groupware/templates/groupwarereadpane.html'
})
export class GroupwareReadPane {
    private emailId: string = "";
    private activetab: 'beans' | 'search' | 'attachments' | 'linked' = 'beans';

    constructor(
        private backend: backend,
        private configuration: configuration,
        private groupware: GroupwareService,
        private http: HttpClient,
        private router: Router,
    ) {
        this.getAttachedBeans();
    }

    private open(tab) {
        this.activetab = tab;
    }

    private openSettings() {
        this.router.navigate(['settings']);
    }

    private archive() {
        this.groupware.archiveEmail().subscribe(
            next => {
                // update message
            },
            error => {
                // display error
            },
            () => {
                // Office.context.ui.closeContainer();
                // todo move that into the specific module
            });
    }

    private getAttachedBeans() {
        let data = {
            message_id: this.groupware.messageId,
        };

        this.backend.postRequest('emails/getattachedbeans', {}, data).subscribe(
            (res: any) => {
                for (let beanId in res) {
                    this.groupware.addBean(res[beanId]);
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    get isArchived() {
        if (this.emailId.length === 0) {
            return false;
        }

        return true;
    }
}
