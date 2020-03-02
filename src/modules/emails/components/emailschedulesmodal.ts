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
    private targetlistname: string = '';

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
    private export() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';

            let selectedIds = this.modellist.getSelectedIDs();
            let params = {
                listtype: this.modellist.currentList.type,
                targetlistname: this.targetlistname,
                owner: this.modellist.currentList.type == 'owner' ? true : false,
                module: this.modellist.module,
                modulefilter: this.modellist.modulefilter,
                searchterm: this.modellist.searchTerm,
                aggregates: this.modellist.selectedAggregates,
                listid: this.modellist.currentList.id,
                ids: selectedIds
            };
        });
    }
}


