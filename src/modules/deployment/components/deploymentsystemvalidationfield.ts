/**
 * @module ModuleDeployment
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {Router} from "@angular/router";
import {toast} from "../../../services/toast.service";

/**
 * field to validate connection to a target system
 */
@Component({
    selector: 'deployment-system-validation-field',
    templateUrl: '../templates/deploymentsystemvalidationfield.html',
})
export class DeploymentSystemValidationField extends fieldGeneric {

    constructor(public model: model,
                public backend: backend,
                public language: language,
                public router: Router,
                public modal: modal,
                public view: view,
                public toast: toast,
                public metadata: metadata,
                public injector: Injector) {
        super(model, view, language, metadata, router);
    }

    /**
     * validate connection to a target system
     */
    public validate() {

        const processing = this.modal.await('LBL_PROCESSING');
        const body = {
            url: this.model.getField('url'),
            systemId: this.model.id,
            username: this.model.getField('sys_username'),
            password: this.model.getField('sys_password'),
        };

        this.backend.postRequest('configuration/deployment/systems/connection/test', null, body).subscribe({
            next: res => {

                this.toast.sendToast(res.message , res.type);

                processing.next(true);
                processing.complete();
            }, error: () => {
                processing.next(false);
                processing.complete();
            }
        });
    }
}
