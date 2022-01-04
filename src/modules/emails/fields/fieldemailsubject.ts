/**
 * @module ObjectFields
 */
import {ChangeDetectorRef, Component, Injector} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {Router} from '@angular/router';
import {broadcast} from "../../../services/broadcast.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {configurationService} from "../../../services/configuration.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

/**
 * display the email subject with status based email icon. The subject will get the style line through when the email is completed.
 */
@Component({
    selector: 'field-email-subject',
    templateUrl: '../templates/fieldemailsubject.html',
})
export class fieldEmailSubject extends fieldGeneric {

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public backend: backend,
                public toast: toast,
                public router: Router,
                public injector: Injector,
                public broadcast: broadcast,
                public configurationService: configurationService,
                public modal: modal,
                public cdRef: ChangeDetectorRef,
                public sanitized: DomSanitizer) {
        super(model, view, language, metadata, router);
    }

    /**
     * @return the email status icon
     */
    get statusIcon() {
        switch (this.model.getField('status')) {
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

    /**
     * @return the email status label
     */
    get statusLabel() {
        switch (this.model.getField('status')) {
            case 'opened':
            case 'read':
                return 'LBL_OPEN';
            case 'bounced':
            case 'deferred':
            case 'send_error':
                return 'LBL_ERROR';
            case 'sent':
                return 'LBL_OUTBOUND';
            default:
                return 'LBL_UNREAD';
        }
    }
}
