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
import {metadata} from "../../../services/metadata.service";
import {FormGroup, FormControl} from '@angular/forms';

@Component({
    selector: "email-schedules-modal",
    templateUrl: "./src/modules/emails/templates/emailschedulesmodal.html",
    providers: [model, view],
})
export class EmailSchedulesModal {
    private self: any = {};
    private componentconfig: any = {};
    constructor(private language: language,
                private model: model,
                private injector: Injector,
                private view: view,
                private modal: modal,
                private metadata: metadata,
                private modellist: modellist,
                private backend: backend) {

        this.view.isEditable = true;
        this.view.setEditMode();

    }

    public ngOnInit() {
        this.model.module = 'EmailSchedules';
        this.model.initialize();
    }

    get itemcount() {
        return this.modellist.listData.totalcount;
    }

    private close() {
        this.self.destroy();
    }


    private saveSchedule() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';
            let selectedIds = this.modellist.getSelectedIDs();
            let params = {
                module: this.modellist.module,
                ids: selectedIds
            };

        });
    }
}


