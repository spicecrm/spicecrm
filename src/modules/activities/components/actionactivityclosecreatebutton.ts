/**
 * @module ModuleActivities
 */
import {Component, Optional, Injector, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {modalwindow} from "../../../services/modalwindow.service";


/**
 * This component shows the closecreatebutton; It opens the "closecreatemodal"
 */
@Component({
    selector: 'action-activity-close-create-button',
    templateUrl: '../templates/actionactivityclosecreatebutton.html'
})
export class ActionActivityCloseCreateButton implements OnInit {

    /**
     * the actionconfig passed in from the actionset
     */
    public actionconfig: any;

    /**
     * to sneure the user cannot click twice
     */
    public saving: boolean = false;

    /**
     * is set in ngInit to check if in the subsequent modal per the configuration there is at least one type the user can create
     * otherwise it does not make sense to offer him the create new option as an empty modal woudl be rendered next
     */
    public canCreate: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public injector: Injector,
        @Optional() public modalwindow: modalwindow
    ) {

    }

    public ngOnInit(): void {
        // check what we can create afterwards and check if the user can cerate any item
        let componentconfig = this.metadata.getComponentConfig('ActivityCloseCreateModal', this.model.module);
        let newBeanModulesString = componentconfig.newBeanModules;
        if (newBeanModulesString) {
            let newBeanModulesArray = newBeanModulesString.split(",");

            for (let item of newBeanModulesArray) {
                // check if the user can create
                if (this.metadata.checkModuleAcl(item, 'create')) {
                    this.canCreate = true;
                    break;
                }
            }
        }

    }

    get disabled() {
        return this.model.checkAccess('edit') ? false : true;
    }

    /**
     * Click: Validation check; Opens the ActivityCloseCreateModal
     */
    public execute() {
        if (this.saving) return;

        // check if we shoudl set the closed status
        if (this.actionconfig.statusfield && this.actionconfig.statusvalue) {
            if (this.model.getField(this.actionconfig.statusfield) != this.actionconfig.statusvalue) {

                if (!this.model.isEditing) {
                    this.model.startEdit();
                }
                this.model.setField(this.actionconfig.statusfield, this.actionconfig.statusvalue);
            }
        }

        if (this.model.validate()) {
            this.saving = true;
            this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
                modalRef.instance.messagelabel = 'LBL_SAVING_DATA';
                this.model.save().subscribe(saved => {
                    // reset the fact that we did save
                    this.saving = false;

                    // close the saving modal
                    modalRef.instance.self.destroy();

                    // if we are in a modal close the modal
                    if (this.modalwindow) this.modalwindow.self.destroy();

                    this.modal.openModal('ActivityCloseCreateModal', true, this.injector).subscribe(editModalRef => {
                        if (editModalRef) {
                            editModalRef.instance.parent = this.model;
                        }
                    });
                });
            });
        } else {
            if (!this.modalwindow) this.model.edit(false);
        }
    }

    /**
     * returns the action label
     *
     * determines if the action can be closed, saved or only new to be created
     */
    get actionlabel() {
        if (this.model.getField(this.actionconfig.statusfield) != this.actionconfig.statusvalue && this.model.getField(this.actionconfig.statusfield) != this.actionconfig.statusvalue) {
            return 'LBL_CLOSE_AND_NEW';
        }

        // if we are editing offer save and new
        if (this.model.isEditing) {
            return 'LBL_SAVE_AND_NEW';
        }

        return 'LBL_NEW';

    }
}





