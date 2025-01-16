/**
 * @module ModuleWorkflow
 */
import {Component, OnInit,} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";

/**
 * @ignore
 */
declare var _;

/**
 * handle managing the workflow task email type
 */
@Component({
    selector: 'workflow-manager-task-types-email',
    templateUrl: '../templates/workflowmanagertasktypesemail.html',
})

export class WorkflowManagerTaskTypesEmail implements OnInit {
    /**
     * holds a list of the available mailboxes
     */
    public mailboxes: { value: string, display: string }[] = [];
    /**
     * holds a list of the available email templates
     */
    public emailTemplates: { id: string, name: string }[] = [];
    /**
     * holds the content option for the email body
     * @private
     */
    public contentOption: 'method' | 'email_template' = 'email_template';

    constructor(private metadata: metadata,
                public model: model,
                private backend: backend,
                private userpreferences: userpreferences,
                public workflowManagerService: WorkflowManagerService,
                private configuration: configurationService) {
        this.contentOption = this.model.data.emailcontclass && this.model.data.emailcontclass.length > 0 ? 'method' : 'email_template';
    }

    get distributionList() {
        return !this.model.data.type_config.distribution_list_id ? null : `${this.model.data.type_config.distribution_list_id}::${this.model.data.type_config.distribution_list_name}`;
    }

    set distributionList(value: string) {
        [
            this.model.data.type_config.distribution_list_id,
            this.model.data.type_config.distribution_list_name
        ] = value.split('::');
    }

    /**
     * load available mailboxes
     * load available email templates
     */
    public ngOnInit() {
        this.loadAvailableMailboxes();
        this.loadAvailableEmailTemplates();
    }

    /**
     * gets the mailbox options for the select
     */
    public loadAvailableMailboxes() {

        const options = this.configuration.getData(`mailboxesoutbound`);

        if (_.isEmpty(options)) {
            this.backend.getRequest("module/Mailboxes/scope", {scope: 'outbound', getHidden: true}).subscribe(
                (results: any) => {

                    this.mailboxes = results.sort((a, b) => a.display.localeCompare(b.display));

                    if (this.mailboxes.length > 0 && !this.model.data.type_config?.mailbox_id) {
                        this.model.data.type_config.mailbox_id = this.mailboxes[0].value;
                    }

                    // cache the options
                    this.configuration.setData(`mailboxesoutbound`, this.mailboxes);
                });
        } else {
            this.mailboxes = options;
        }
    }

    /**
     * gets the email templates options for the select
     */
    public loadAvailableEmailTemplates() {

        const options = this.configuration.getData(`EmailTemplates`);

        if (_.isEmpty(options)) {
            this.backend.getList('EmailTemplates', [], {start: 0, limit: 500}).subscribe(
                (data: any) => {

                    this.emailTemplates = data.list.filter(et => et.type == 'email' && (et.for_bean == '*' || et.for_bean == this.workflowManagerService.currentModule.name));
                    // cache the options
                    this.configuration.setData(`EmailTemplates`, data.list);
                });
        } else {
            this.emailTemplates = options.filter(et => et.type == 'email' && (et.for_bean == '*' || et.for_bean == this.workflowManagerService.currentModule.name));
        }
    }

    /**
     * set the email template config in the type_config json
     * @param value
     */
    public setEmailTemplate(value: { id, name }) {
        this.model.data.type_config.emailtemplate_id = value.id;
    }
}
