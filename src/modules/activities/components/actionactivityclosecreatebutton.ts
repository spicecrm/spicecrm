/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, OnInit, Output, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";

/**
 * This component shows the closecreatebutton; It opens the "closecreatemodal"
 */
@Component({
    selector: 'action-activity-close-create-button',
    templateUrl: './src/modules/activities/templates/actionactivityclosecreatebutton.html'
})
export class ActionActivityCloseCreateButton implements OnInit {

    @Output() public  actionemitter: EventEmitter<any> = new EventEmitter<any>();
    public componentconfig: any;
    private saving: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private modalcc: modal,
        private viewContainerRef: ViewContainerRef
    ) {

    }

    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig('ActionActivityCloseButton', this.model.module);
    }

    /**
     * Click: Validation check; Opens the ActivityCloseCreateModal
     */
    public execute() {
        if(this.saving) return;
        if(this.model.validate()) {
            this.saving = true;
            this.model.save().subscribe(saved => {

                this.actionemitter.emit(true);
                this.modalcc.openModal('ActivityCloseCreateModal', true, this.viewContainerRef.injector).subscribe(editModalRef => {
                    if (editModalRef) {
                        editModalRef.instance.parent = this.model;
                    }
                });
            });
        }
    }
}





