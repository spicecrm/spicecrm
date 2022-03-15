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
            case 'deferred':
            case 'send_error':
                return 'error';
            case 'sent':
                return 'send';
            default:
                return 'email';
        }
    }

}
