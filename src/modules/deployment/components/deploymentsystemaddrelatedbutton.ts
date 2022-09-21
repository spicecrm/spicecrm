/**
 * @module ModuleDeployment
 */
import {Component, ComponentRef, Injector, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {relatedmodels} from "../../../services/relatedmodels.service";
import {metadata} from "../../../services/metadata.service";

/**
 * deployment add related action
 */
@Component({
    selector: 'deployment-system-add-related-button',
    templateUrl: '../templates/deploymentsystemaddrelatedbutton.html',
    providers: [model]
})
export class DeploymentSystemAddRelatedButton {

    public disabled: boolean = true;

    constructor(@SkipSelf() public parent: model,
                public model: model,
                public backend: backend,
                public language: language,
                public modal: modal,
                public relatedmodels: relatedmodels,
                public metadata: metadata,
                public injector: Injector) {

    }

    public ngOnInit() {
        this.model.module = 'SystemDeploymentSystems';
        if (this.metadata.checkModuleAcl(this.model.module, "create")) {
            this.disabled = false;
        }
    }

    /**
     * add new related system
     */
    public execute() {

        if (!this.parent.getField('id')) {
            this.parent.setField('id', this.parent.id);
        }

        // make sure we have no id so a new on gets issues
        this.model.id = "";

        // add the model
        this.model.addModel("", this.parent).subscribe(data => {

            if (!data) return;

            const processing = this.modal.await('LBL_PROCESSING');

            this.backend.postRequest(`configuration/deployment/systems/related/${this.parent.id}`, null, {data}).subscribe({
                next: () => {
                    this.relatedmodels.getData();
                    processing.next(true);
                    processing.complete();
                }, error: () => {
                    processing.next(false);
                    processing.complete();
                }
            });
        });


    }
}
