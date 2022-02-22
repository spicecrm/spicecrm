/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, OnInit, Optional, Output} from '@angular/core';
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
    templateUrl: '../templates/objectactionmodalsavebutton.html',
    providers: [helper]
})
export class ObjectActionModalSaveButton {

    /**
     * emits the action. can emit save or savegodetail
     */
    @Output() public  actionemitter: EventEmitter<any> = new EventEmitter<any>();

    public actionconfig: any = {};

    constructor(public language: language, public metadata: metadata, public model: model, public modal: modal,  @Optional()public modalwindow: modalwindow) {}

    get displayLabel() {
        // see if we have a label configured
        if(this.actionconfig.label) return this.actionconfig.label;

        // else standard labels
        return this.actionconfig.gorelated ? 'LBL_SAVE_AND_GO_TO_RECORD' : 'LBL_SAVE';
    }

    public execute() {
        if (this.model.validate()) {
            if (this.model.isNew && this.metadata.getModuleDuplicatecheck(this.model.module)) {
                this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
                    modalRef.instance.messagelabel = 'LBL_CHECKING_DUPLICATES';
                    this.model.duplicateCheck(true).subscribe(dupdata => {
                        modalRef.instance.self.destroy();
                        if (dupdata.count > 0) {
                            this.model.duplicates = dupdata.records;
                            this.model.duplicatecount = dupdata.count;
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
    public saveModel() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING_DATA';
            this.model.save(true).subscribe(status => {
                    this.model.endEdit();
                    if (status) {
                        /// if go Deail go to record)
                        if (this.actionconfig.gorelated) {
                            this.actionemitter.emit('savegodetail');
                        }
                    }
                    modalRef.instance.self.destroy();

                    // emit that we saved
                    this.actionemitter.emit('save');
                },
                error => {
                    modalRef.instance.self.destroy();
                });
        });
    }
}
