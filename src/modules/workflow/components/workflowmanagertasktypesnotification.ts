import {Component} from '@angular/core';
import {model} from "../../../services/model.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";

@Component({
    selector: 'workflow-manager-task-types-notification',
    templateUrl: '../templates/workflowmanagertasktypesnotification.html'
})
export class WorkflowManagerTaskTypesNotification {

    constructor(public model: model,
                public workflowManagerService: WorkflowManagerService) {
    }

    /**
     * set recipient
     * @param data
     */
    public setRecipient(data) {

        this.model.data.type_config.recipient_assigntype = data.assigntype;

        switch (data.assigntype) {
            case '1':
                this.model.data.type_config.recipient_assigntouser = data.assigntouser;
                this.model.data.type_config.recipient_assigntouser_name = data.assigntouser_name;
                break;
            case '5':
                this.model.data.type_config.recipient_assignfile = data.assignfile;
                this.model.data.type_config.recipient_assignclass = data.assignclass;
                this.model.data.type_config.recipient_assignmethod = data.assignmethod;
                this.model.data.type_config.recipient_assignparams = data.assignparams;
                break;
            case '7':
            case '9':
                this.model.data.type_config.recipient_assigntoorgunit = data.assigntoorgunit;
                this.model.data.type_config.recipient_assigntoorgunit_name = data.assigntoorgunit_name;
                break;
        }
    }
}