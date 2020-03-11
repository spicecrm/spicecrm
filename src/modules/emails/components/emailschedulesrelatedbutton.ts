/**
 * @module ModuleEmails
 */
import {Component, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";


@Component({
    selector: "email-schedules-realted-button",
    templateUrl: "./src/modules/emails/templates/emailschedulesrelatedbutton.html",
})
export class EmailSchedulesRelatedButton {
    public prospects: any = [];
    public disabled: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector,
        private backend: backend,
        private toast: toast,
    ) {
    }

    public ngOnInit() {
        this.checkEmailsLink();
    }

    public execute() {
        this.modal.openModal('EmailSchedulesRelatedModal', true, this.injector).subscribe( modal => {
               modal.instance.prospects = this.prospects;
            });
    }

    /**
     * iterate through the model fields, find each field that is of type link, get the module name, and find these modules have an emails link
     * post object with array to backend
     */
    private checkEmailsLink() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';
            // let arrayOfModules = [];
            // Object.keys(this.model.fields).forEach(item => {
            //     if (this.model.fields[item].type == 'link' && this.model.fields[item].hasOwnProperty('vname') && !this.model.fields[item].hasOwnProperty('link_type')) {
            //         let module = this.language.getLabel(this.model.fields[item].vname).split(" ").join("");
            //         arrayOfModules.push(module);
            //
            //     }
            // });
            // let body = {arrayOfModules};
            this.backend.getRequest(`/module/${this.model.module}/${this.model.id}/checkProspectListsProspects`).subscribe(result => {
                loadingRef.instance.self.destroy();
                if (result.status) {
                    this.prospects = result.prospects;
                } else {
                    this.toast.sendToast(result.msg, 'error');
                }
            });
        });
    }

}
