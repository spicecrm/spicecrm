/**
 * @module ServiceComponentsModule
 */
import {Component, SkipSelf, Injector} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {ServiceSelectQueueModal} from "./serviceselectqueuemodal";


@Component({
    selector: 'service-select-queue-button',
    templateUrl: '../templates/serviceselectqueuebutton.html'
})
export class ServiceSelectQueueButton {
    /**
     * holds the action config
     */
    public actionconfig: any = {};

    constructor(
        public model: model,
        public metadata: metadata,
        public language: language,
        public modal: modal,
        public injector: Injector
    ) {
        this.model.mode$.subscribe(mode => {
            this.canChange();
        });

    }


    get buttonLabel() {
        if(!!this.model.getField('return_to_servicequeue_id')){
            return 'LBL_RETURN_TO_QUEUE'
        }
        return this.actionconfig.label ? this.actionconfig.label : 'LBL_FORWARD';
    }

    public canChange() {
        if (!this.model.checkAccess('edit')) return false;

        let resolveDate = this.model.getField('resolve_date');
        if (resolveDate && resolveDate.isValid && resolveDate.isValid()) {
            return false;
        }
        if(!!this.model.getField('return_to_servicequeue_id')) return false;

        return this.model.isEditing ? false : true;
    }

    public execute() {
        if(!!this.model.getField('return_to_servicequeue_id')){
            this.modal.openModal('ServiceReturnToQueueModal', true, this.injector);
        }
        else if (this.canChange) {
            this.modal.openModal('ServiceSelectQueueModal', true, this.injector);
        }
    }

    public getDisplay() {
        return this.canChange ? 'inherit' : 'none';
    }
}
