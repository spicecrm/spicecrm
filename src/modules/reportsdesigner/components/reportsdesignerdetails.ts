/**
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'reports-designer-details',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerdetails.html'
})
export class ReportsDesignerDetails implements OnInit {

    protected categories: any[] = [];

    constructor(private language: language, private model: model, private backend: backend) {
    }

    public ngOnInit() {
        if (!this.model.getField('reportoptions')) {
            this.model.setField('reportoptions', {});
        }
        this.loadCategories();
    }

    /**
     * load reports categories from backend
     */
    private loadCategories() {
        this.backend.getRequest('KReporter/categoriesmanager/categories').subscribe(categories => {
            if (!!categories) this.categories = categories;
        });
    }

    /**
    * @return reportoptions: object[]
     */
    get reportOptions() {
        return this.model.getField('reportoptions');
    }
}
