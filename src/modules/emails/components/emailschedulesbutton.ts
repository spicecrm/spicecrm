/**
 * @module ModuleEmails
 */
import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modellist} from '../../../services/modellist.service';
import {modal} from '../../../services/modal.service';


@Component({
    selector: "email-schedules-button",
    templateUrl: "./src/modules/emails/templates/emailschedulesbutton.html",
})
export class EmailSchedulesButton {
    public disabled: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modellist: modellist,
        private modal: modal,
        private injector: Injector
    ) {}

    get exportcount() {
        let selectedCount = this.modellist.getSelectedCount();
        return selectedCount ? selectedCount : this.modellist.listData.totalcount;
    }
    public execute() {
        this.modal.openModal('EmailSchedulesModal', true, this.injector);
    }
}
