/**
 * @module ModuleActivities
 */
import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {Subscription} from "rxjs";

/**
 * This component shows the closebutton of an activity
 */
@Component({
    selector: 'action-activity-close-button',
    templateUrl: '../templates/actionactivityclosebutton.html'
})
export class ActionActivityCloseButton implements OnInit, OnDestroy {

    /**
     * only "disabled" is in use !
     */
    public hidden: boolean = false;

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    /**
     * if the button shoudl be disabled
     */
    public disabled: boolean = true;

    /**
     * the component config
     */
    public componentconfig: any;

    /**
     * holds the components subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public viewContainerRef: ViewContainerRef
    ) {

    }

    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig('ActionActivityCloseButton', this.model.module);

        if(this.model.getField(this.componentconfig.statusField) == this.componentconfig.statusValues) {
            this.handleDisabled('display');
        }

        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');

        this.subscriptions.add(
            this.model.mode$.subscribe(mode => {
                this.handleDisabled(mode);
            })
        );

        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
            })
        );
    }

    /**
     * unsubscribe from various subscrioptions on destroy
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
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

    /**
     * handles the setting of the disbaled attribute
     *
     * @param mode
     */
    public handleDisabled(mode) {
        if (!this.model.checkAccess('edit')) {

            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit' ? true : false;
    }
}
