/**
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";

import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";


/**
 * renders the details panel in the report designer
 */
@Component({
    selector: 'reports-designer-details',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerdetails.html'
})
export class ReportsDesignerDetails implements OnInit {

    /**
     * the fieldset
     */
    private fieldset: string;

    constructor(private language: language, private model: model, private backend: backend, private metadata: metadata) {

    }

    public ngOnInit() {

        // load the config for the fieldset
        let componentconfig = this.metadata.getComponentConfig('ReportsDesignerDetails', this.model.module);
        this.fieldset = componentconfig.fieldset;

        if (!this.model.getField('reportoptions')) {
            this.model.setField('reportoptions', {});
        }
    }


    /**
    * @return reportoptions: object[]
     */
    get reportOptions() {
        return this.model.getField('reportoptions');
    }
}
