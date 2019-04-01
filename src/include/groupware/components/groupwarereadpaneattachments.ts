import {Component, ChangeDetectorRef} from '@angular/core';
// import AsyncResultStatus = Office.AsyncResultStatus;
import {Subject, Observable} from 'rxjs';
import {GroupwareService} from '../services/groupware.service';
import {configuration} from "../services/configuration.service";

@Component({
    selector: 'groupware-read-pane-attachments',
    templateUrl: './src/include/groupware/templates/groupwarereadpaneattachments.html'
})
export class GroupwareReadPaneAttachments {

    constructor(
        private groupware: GroupwareService,
        private changeDetectorRef: ChangeDetectorRef,
        private configuration: configuration,
    ) {
        this.loadAttachments();
    }

    get attachments() {
        return this.configuration.serviceRequest.attachments;
    }

    public loadAttachments() {
        this.groupware.getAttachments().subscribe(
            (res: any) => {
                // todo get a list of the already selected attachments
                this.changeDetectorRef.detectChanges();
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
