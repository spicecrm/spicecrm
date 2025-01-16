import {Component} from '@angular/core';
import {model} from "../../../services/model.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {EnumDisplayOptionArray, language} from "../../../services/language.service";

@Component({
    selector: 'workflow-manager-task-types-notification',
    templateUrl: '../templates/workflowmanagertasktypesnotification.html'
})
export class WorkflowManagerTaskTypesNotification {

    public options: EnumDisplayOptionArray = [];

    constructor(public model: model,
                private language: language,
                public workflowManagerService: WorkflowManagerService) {
        this.options = this.language.getFieldDisplayOptions('WorkflowTaskDefinitions', 'assigntype', true);
        this.options.push({value: '10', display: this.language.getLabel('LBL_DISTRIBUTIONLIST'), status: 'a'});
    }

    /**
     * get recipient value by key
     * @param key
     */
    public getRecipientValue(key: string) {
        return !this.model.data.type_config[key] ? null : `${this.model.data.type_config[key]}::${this.model.data.type_config[key + '_name']}`;
    }

    /**
     * set recipient value and name by key
     * @param value
     * @param key
     */
    public setRecipientValue(value: string, key: string) {
        [
            this.model.data.type_config[key],
            this.model.data.type_config[key + '_name']
        ] = value.split('::');
    }
}