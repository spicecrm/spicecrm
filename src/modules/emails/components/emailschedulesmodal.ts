/**
 * @module ModuleEmails
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: "email-schedules-modal",
    templateUrl: "./src/modules/emails/templates/emailschedulesmodal.html",
})
export class EmailSchedulesModal {
    private self: any = {};
    private componentconfig: any = {};

    constructor(private language: language,
                private model: model,
                private injector: Injector,
                private view: view,
                private modal: modal,
                private modellist: modellist,
                private backend: backend) {

    }

    get itemcount() {
        return this.modellist.listData.totalcount;
    }

    private close() {
        this.self.destroy();
    }

    /**
     * @openModal ObjectModalModuleLookup
     * @pass module
     * @pass multiselect
     * @setField email_subject
     * @setField email_body
     * @setField email_stylesheet_id
     */
    private copyFromTemplate() {
        this.modal.openModal('ObjectModalModuleLookup', true, this.injector)
            .subscribe(selectModal => {
                selectModal.instance.module = 'EmailTemplates';
                selectModal.instance.multiselect = false;
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.model.setField('email_subject', items[0].subject);
                        this.model.setField('email_body', items[0].body_html);
                        this.model.setField('email_stylesheet_id', items[0].style);
                    }
                });
            });
    }

    private send() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';

            let selectedIds = this.modellist.getSelectedIDs();
            let params = {
                module: this.modellist.module,
                // subject:,
                //                 // body:,
                //                 // stylesheetid:,
                //                 // mailbox:,
                ids: selectedIds
            };
            window.console.log(params);
        });
    }
}


