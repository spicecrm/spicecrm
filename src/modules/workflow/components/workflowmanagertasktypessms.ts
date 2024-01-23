/**
 * @module ModuleWorkflow
 */
import {Component,} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {configurationService} from "../../../services/configuration.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {backend} from "../../../services/backend.service";
import { take } from 'rxjs/operators';

/**
 * @ignore
 */
declare var _;

/**
 * handle managing the workflow task sms type
 */
@Component({
    selector: 'workflow-manager-task-types-sms',
    templateUrl: '../templates/workflowmanagertasktypessms.html',
})
export class WorkflowManagerTaskTypesSms {
    /**
     * holds a list of the available mailboxes
     */
    public mailboxes: { value: string, display: string }[] = [];
    /**
     * holds a list of the available email templates
     */
    public textMessageTemplates: { id: string, name: string }[] = [];
    /**
     * holds the content option for the email body
     * @private
     */
    public contentOption: 'method' | 'sms_template' = 'sms_template';

    constructor(private metadata: metadata,
                public model: model,
                private backend: backend,
                private userpreferences: userpreferences,
                public workflowManagerService: WorkflowManagerService,
                private configuration: configurationService) {
        this.contentOption = this.model.data.emailcontclass && this.model.data.emailcontclass.length > 0 ? 'method' : 'sms_template';
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
            this.backend.getRequest("module/Mailboxes/scope", {scope: 'outboundsms'}).subscribe(
                (results: any) => {

                    this.mailboxes = results.sort((a, b) => a.display.localeCompare(b.display));

                    if (this.mailboxes.length > 0 && !this.model.data.type_config?.mailbox) {
                        this.model.data.type_config.mailbox = this.mailboxes[0].value;
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
    public loadAvailableEmailTemplates()
    {
        this.backend.getList('TextMessageTemplates', [], {start: 0, limit: 500})
            .pipe(take(1))
            .subscribe({
                next: (data: any) => {
                    this.textMessageTemplates = data.list.filter(et => et.parent_type == '*' || et.parent_type == this.workflowManagerService.currentModule.name);
                    this.configuration.setData(`TextMessageTemplates`, this.textMessageTemplates); // cache the options
                }
            });
    }

    /**
     * set the email template config in the type_config json
     * @param value
     */
    public setEmailTemplate(value: { id, name }) {
        this.model.data.type_config.emailtemplate_id = value.id;
    }
}
