/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/reports/templates/fieldreportcategory.html',
})
export class FieldReportCategory extends fieldGeneric {

    protected categories: any[] = [];

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
    private loadCategories() {
        const categories = this.configuration.getData('reportcategories');
        if (!categories) {
            this.backend.getRequest('KReporter/categoriesmanager/categories').subscribe(categories => {
                if (!!categories) this.categories = categories;
            });
        } else {
            this.categories = categories;
        }
    }

}
