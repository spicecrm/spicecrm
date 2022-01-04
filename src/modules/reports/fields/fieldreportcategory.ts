/**
 * @module ModuleReports
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: 'field-report-category',
    templateUrl: '../templates/fieldreportcategory.html',
})
export class FieldReportCategory extends fieldGeneric {

    public categories: any[] = [];

    constructor(public language: language,
                public router: Router,
                public view: view,
                public backend: backend,
                public configuration: configurationService,
                public metadata: metadata,
                public model: model) {
        super(model, view, language, metadata, router);
        this.loadCategories();
    }

    /**
     * @param value: string
     */
    set valueId(value) {
        this.model.setField('category_id', value);
    }

    /**
     * @return category_id: string
     */
    get valueId() {
        return this.model.getField('category_id');
    }

    /**
     * load reports categories from backend
     */
    public loadCategories() {
        const categories = this.configuration.getData('reportcategories');
        if (!categories) {
            this.backend.getRequest('module/KReports/categoriesmanager/categories').subscribe(categories => {
                if (!!categories) this.categories = categories;
            });
        } else {
            this.categories = categories;
        }
    }

}
