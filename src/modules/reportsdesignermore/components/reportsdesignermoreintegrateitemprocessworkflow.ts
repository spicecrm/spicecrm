import {Component, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'reports-designer-more-integrate-item-process-workflow',
    templateUrl: '../templates/reportsdesignermoreintegrateitemprocessworkflow.html'
})

export class ReportsDesignerMoreIntegrateItemProcessWorkflow implements OnInit {

    /**
     * holds the component config
     */
    public componentconfig: { moduleFilter: string };

    constructor(public model: model, private metadata: metadata) {
    }

    public ngOnInit() {
        if (!this.model.data.integration_params.kprocessworkflow) {
            this.model.data.integration_params.kprocessworkflow = {};
        }

        this.componentconfig = this.metadata.getComponentConfig('ReportsDesignerMoreIntegrateItemProcessWorkflow', 'KReports');
    }

    /**
     * set definition idName
     * @param idName
     */
    public setDefinitionId(idName: string) {
        this.model.data.integration_params.kprocessworkflow.definition_id = !idName ? '' : idName.split('::')[0];
    }
}