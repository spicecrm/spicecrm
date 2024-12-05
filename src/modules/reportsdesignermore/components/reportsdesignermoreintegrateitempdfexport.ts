/**
 * @module ModuleReportsDesignerMore
 */
import {Component, Injector} from '@angular/core';
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'reports-designer-more-integrate-item-pdf-export',
    templateUrl: '../templates/reportsdesignermoreintegrateitempdfexport.html',
})
export class ReportsDesignerMoreIntegrateItemPdfExport {
    public templates: any = [];
    public outputtemplate_id: string = '';
    public isLoaded: boolean = false;

    constructor(public language: language,
                public model: model,
                public metadata: metadata,
                public injector: Injector,
                public modal: modal,
                public configuration: configurationService,
                public backend: backend) {
    }


    /**
     * initialize the plugin properties
     */
    public ngOnInit() {
        let outPutTemplates = this.configuration.getData('OutputTemplates');
        if (outPutTemplates && outPutTemplates[this.model.module]) {
            this.templates = outPutTemplates[this.model.module];
            this.isLoaded = true;
            this.initializeProperties();
        } else {
            this.backend.getRequest('module/OutputTemplates/formodule/' + this.model.module, {}).subscribe(
                (data: any) => {
                    // set the templates
                    this.configuration.setData('OutputTemplates', data);

                    // set the templates internally
                    this.templates = data;

                    this.isLoaded = true;
                    this.initializeProperties();
                }
            );
        }
    }

    /**
     * set the initial plugin properties
     */
    public initializeProperties() {
        let integrationParams = this.model.getField('integration_params');
        if (!integrationParams.kpdfexport) {
            integrationParams.kpdfexport = {
                outputtemplate_id: ''
            };
            this.model.setField('integration_params', integrationParams);
        }
        if (this.templates.length === 1) {
            this.outputtemplate_id = this.templates[0].id;
            integrationParams.kpdfexport.outputtemplate_id = this.outputtemplate_id;
            this.model.setField('integration_params', integrationParams);
        }
        else{
            this.outputtemplate_id = integrationParams.kpdfexport.outputtemplate_id;
        }
    }

    get kpdfexport() {
        return this.model.getField('integration_params').kpdfexport;
    }


}
