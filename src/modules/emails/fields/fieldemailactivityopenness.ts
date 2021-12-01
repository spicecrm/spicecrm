/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {Router} from '@angular/router';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

/**
 * display the email subject with status based email icon. The subject will get the style line through when the email is completed.
 */
@Component({
    selector: 'field-email-activity-openness',
    templateUrl: '../templates/fieldemailactivityopenness.html',
})
export class fieldEmailActivityOpenness extends fieldGeneric {

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public backend: backend,
                public toast: toast,
                public router: Router) {
        super(model, view, language, metadata, router);
    }

    /**
     * set the openness value in the model and update on the backend
     * @param openness
     */
    public setOpenness(openness: 'open' | 'user_closed' | 'system_closed') {

        this.model.setField("openness", openness);

        this.backend.postRequest(`module/${this.model.module}/${this.model.id}/openness`, null, {openness}).subscribe(
            (res: any) => {
                // also set it in the service
            },
            (err: any) => {
                this.toast.sendAlert('Cannot change openness to ' + openness);
            }
        );
    }
}
