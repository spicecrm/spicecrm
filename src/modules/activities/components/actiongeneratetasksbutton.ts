/**
 * @module ModuleActivities
 */
import {Component, Injector, OnDestroy, OnInit, SkipSelf, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * generates tasks from atesxt field using AI
 */
@Component({
    selector: 'action-generate-tasks-button',
    templateUrl: '../templates/actiongeneratetasksbutton.html',
    standalone: false
})
export class ActionGenerateTasksButton {


    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    /**
     * if the button shoudl be disabled
     */
    public disabled: boolean = false;

    /**
     * the component config
     */
    public actionconfig: any;


    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        @SkipSelf() public parent: model,
        public modal: modal,
        public backend: backend,
        public injector: Injector,
        public configurationService: configurationService
    ) {
    }

    get hidden(){
        return  !this.configurationService.getCapabilityConfig('generative_ai')?.isActive
    }

    /**
     * Click: It opens a modal with the action- and componentset in the "module configuration"
     */
    public execute() {
        this.modal.openModal('ActionGenerateTasksModal', true, this.injector);

    }
}
