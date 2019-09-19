/**
 * @module ObjectComponents
 */
import {Component, OnInit, Optional} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modalwindow} from '../../services/modalwindow.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";

/**
 * a standard actionset item to open a model
 */
@Component({
    selector: 'object-action-modal-save-button',
    templateUrl: './src/objectcomponents/templates/objectactionmodalsavebutton.html',
    providers: [helper]
})
export class ObjectActionModalSaveButton {

    private actionconfig: any = {};

    constructor(private language: language, private metadata: metadata, private model: model, private modal: modal,  @Optional()private modalwindow: modalwindow) {}

    get displayLabel(){
        return this.actionconfig.gorelated ? 'LBL_SAVE_AND_GO_TO_RECORD' : 'LBL_SAVE';
    }

    public execute() {
        if (this.model.validate()) {
            if (this.model.isNew && this.metadata.getModuleDuplicatecheck(this.model.module)) {
                this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
                    modalRef.instance.messagelabel = 'LBL_CHECKING_DUPLICATES';
                    this.model.duplicateCheck(true).subscribe(dupdata => {
                        modalRef.instance.self.destroy();
                        if (dupdata.length > 0) {
                            this.model.duplicates = dupdata;
                            // this.modalContent.element.nativeElement.scrollTop = 0;
                            // this.showDuplicatesTable = true;
                            this.modal.confirm(this.language.getLabel('MSG_DUPLICATES_FOUND', null,'long'), this.language.getLabel('MSG_DUPLICATES_FOUND')).subscribe(confirmed => {
                                if (confirmed) this.saveModel();
                            });
                        } else {
                            this.saveModel();
                        }
                    });
                });
            } else {
                this.saveModel();
            }
        }
    }

    /**
     * save the model but without duplicate check
     *
     * @param goDetail if set to true the system will naviaget to the detail fo teh record after saving
     */
    private saveModel() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING_DATA';
            this.model.save(true).subscribe(status => {
                    this.model.isEditing = false;
                    if (status) {
                        /// if go Deail go to record)
                        if (this.actionconfig.gorelated) {
                            this.model.goDetail();
                        }
                    }
                    modalRef.instance.self.destroy();

                    // destroy the modal window
                    if(this.modalwindow) this.modalwindow.self.destroy();
                },
                error => {
                    modalRef.instance.self.destroy();
                });
        });
    }
}