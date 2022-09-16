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
import {ObjectModalModuleLookup} from "../../../objectcomponents/components/objectmodalmodulelookup";
import {take} from "rxjs/operators";

/**
 * deployment select related action
 */
@Component({
    templateUrl: '../templates/deploymentsystemselectrelatedbutton.html',
    providers: [model]
})
export class DeploymentSystemSelectRelatedButton {

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
        // set model.module from relatedmodels
        this.model.module = 'SystemDeploymentSystems';

        // enable button if the list action granted.
        if (this.metadata.checkModuleAcl(this.model.module, "list")) {
            this.disabled = false;
        }
    }

    /**
     * select a related system
     */
    public execute() {

        this.modal.openModal('ObjectModalModuleLookup').subscribe((selectModal: ComponentRef<ObjectModalModuleLookup>) => {

            selectModal.instance.module = 'SystemDeploymentSystems';

            selectModal.instance.selectedItems.pipe(take(1)).subscribe(items => {

                const processing = this.modal.await('LBL_PROCESSING');

                this.backend.postRequest(`configuration/deployment/systems/related/${this.parent.id}`, null, {data: items[0]}).subscribe({
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
        });
    }
}
