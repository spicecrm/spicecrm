/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {Router} from '@angular/router';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    templateUrl: '../templates/fieldemailstatus.html'
})
export class fieldEmailStatus extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    // get a status icon
    get statusicon() {
        switch (this.value) {
            case 'opened':
            case 'read':
                return 'email_open';
            case 'bounced':
            case 'bounced_checked':
                return 'turn_off_notifications';
            case 'deferred':
                return 'hourglass';
            case 'send_error_checked':
            case 'send_error':
            case 'error':
                return 'error';
            case 'sent':
                return 'send';
            case 'archived':
                return 'archive';
            default:
                return 'email';
        }
    }


    get direction(){
        return this.model.getField('type');
    }

    /**
     * @return color class for the icon
     */
    get iconColorClass() {
        switch (this.value) {
            case 'opened':
            case 'read':
            case 'sent':
            case 'delivered':
                return 'slds-icon-text-success';
            case 'bounced':
            case 'bounced_checked':
            case 'deferred':
            case 'unread':
                return 'slds-icon-text-warning';
            case 'send_error_checked':
            case 'send_error':
            case 'error':
                return 'slds-icon-text-error';
            default:
                return 'slds-icon-text-default';
        }
    }
}
