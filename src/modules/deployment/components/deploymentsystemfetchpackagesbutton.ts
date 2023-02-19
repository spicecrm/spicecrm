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
import {DeploymentSystemPackagesModal} from "./deploymentsystempackagesmodal";

/**
 * fetch packages action
 */
@Component({
    selector: 'deployment-fetch-packages-button',
    templateUrl: '../templates/deploymentfetchpackagesbutton.html',
})
export class DeploymentFetchPackagesButton {

    public disabled: boolean = false;

    constructor(@SkipSelf() public parent: model,
                public model: model,
                public backend: backend,
                public language: language,
                public modal: modal,
                public relatedmodels: relatedmodels,
                public metadata: metadata,
                public injector: Injector) {

    }

    /**
     * load packages from a system
     */
    public execute() {

        const processing = this.modal.await('LBL_LOADING');

        this.backend.getRequest(`configuration/deployment/system/${this.relatedmodels.id}/packages/${this.model.id}`).subscribe({
            next: res => {
                this.modal.openModal('DeploymentSystemPackagesModal', true, this.injector).subscribe(
                    (modalRef: ComponentRef<DeploymentSystemPackagesModal>) => {
                        modalRef.instance.packages = res.packages;
                        modalRef.instance.parentId = this.relatedmodels.id;
                    }
                )
                processing.next(true);
                processing.complete();
            }, error: () => {
                processing.next(false);
                processing.complete();
            }
        });
    }
}
