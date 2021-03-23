/**
 * @module ModuleEmails
 */
import {Component, Injector, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: "email-schedules-related-modal",
    templateUrl: "./src/modules/emails/templates/emailschedulesrelatedmodal.html",
    providers: [model, view],
})
export class EmailSchedulesRelatedModal {
    private self: any = {};
    private activetab: string = 'recipients';
    private linkedBeans: any[] = [];
    private modelId: string;
    private currentModule: string;
    constructor(private language: language,
                private model: model,
                @SkipSelf() private parentModel: model,
                private injector: Injector,
                private view: view,
                private modal: modal,
                private metadata: metadata,
                private backend: backend,
                private toast: toast) {

        this.view.isEditable = true;
        this.view.setEditMode();

    }

    /**
     * initalize emailschedules and filter the linkedBeans
     */
    public ngOnInit() {
        // set the module
        this.model.module = "EmailSchedules";
        // initialize the model
        this.model.initialize(this.parentModel);
        this.model.data.parent_id = this.parentModel.id;
        this.model.data.parent_type = this.parentModel.module;
        // start editing
        this.model.startEdit(false);

        this.fiilterProspects();

    }

    /**
     * if the count of the linked beans is equal to 0 it will be disabled and unselectable
     */
    private fiilterProspects() {
        this.linkedBeans = this.linkedBeans.map(link => {
            link.disabled = link.count == 0;
            link.selected = false;
            return link;
        });
    }

    /**
     * destroy modal instance
     */
    private close() {
        this.self.destroy();
    }

    /**
     * save the emailschedule model data, the current bean id, the current bean name, the selected links and send the object to the backend
     */
    private saveSchedule() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';
            const selectedLinks = this.linkedBeans.filter(link => link.selected).map(link => link.module);
            let body = {
                beanId: this.modelId,
                bean: this.currentModule,
                links: selectedLinks,
                id: this.model.id,
                data: this.model.data
            };
            let mailboxCondition = body.data.hasOwnProperty('mailbox_id');
            let emailsubjectCondition = body.data.hasOwnProperty('email_subject');
            let selectedLinksCondition = selectedLinks.length > 0;
            if(mailboxCondition && emailsubjectCondition && selectedLinksCondition) {
                this.backend.postRequest('modules/EmailSchedules/saveScheduleFromRelated', {}, body).subscribe(result => {
                    loadingRef.instance.self.destroy();
                    if (result.status) {
                        this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                        this.close();
                    } else {
                        this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                    }
                });
            } else {
                loadingRef.instance.self.destroy();
                let errorOccured = "Following errors occured: ";
                if(!mailboxCondition) {
                    errorOccured += "Mailbox field is emtpy ";
                }
                if(!emailsubjectCondition) {
                    errorOccured += "Email subject is missing ";
                }
                if(!selectedLinksCondition) {
                    errorOccured += "No recipients selected ";
                }
                this.toast.sendAlert(errorOccured, 'warning');
            }

        });
    }

}


