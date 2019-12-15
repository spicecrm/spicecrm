/**
 * @module ObjectComponents
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";

/**
 * This component shows the closebutton of an activity
 */
@Component({
    selector: 'action-activity-close-button',
    templateUrl: './src/modules/activities/templates/actionactivityclosebutton.html'
})
export class ActionActivityCloseButton implements OnInit {

    /**
     * only "disabled" is in use !
     */
    public hidden: boolean = false;

    public disabled: boolean = true;
    public componentconfig: any;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private viewContainerRef: ViewContainerRef
    ) {

    }

    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig('ActionActivityCloseButton', this.model.module);

        if(this.model.data[this.componentconfig.statusField] == this.componentconfig.statusValues) {
            this.handleDisabled('display');
        }

        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        this.model.mode$.subscribe(mode => {
            this.handleDisabled(mode);
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    /**
     * Click: It opens a modal with the action- and componentset in the "module configuration"
     */
    public execute() {
        let componentSet = this.componentconfig.componentset;
        let actionSet = this.componentconfig.actionset;
        this.modal.openModal('ActivityCloseModal', true, this.viewContainerRef.injector).subscribe(editModalRef => {
            if (editModalRef) {
                if (componentSet && componentSet != "") {
                    editModalRef.instance.componentSet = componentSet;
                }
                if (actionSet && actionSet != "") {
                    editModalRef.instance.actionSet = actionSet;
                }
                this.model.startEdit();
            }
        });
    }
    private handleDisabled(mode) {
        if (this.model.data.acl && !this.model.checkAccess('edit')) {

            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit' ? true : false;
    }
}
