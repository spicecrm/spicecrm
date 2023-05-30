/**
 * @module ModuleProcurementDocs
 */
import {Component, Optional} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {configurationService} from '../../../services/configuration.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {procurementdocrecord} from "../services/procurementdocrecord";

import {Router} from '@angular/router';

@Component({
    selector: 'field-procurement-doc-taxcategories',
    templateUrl: '../templates/fieldprocurementdoctaxcategories.html'
})
export class fieldProcurementDocTaxCategories extends fieldGeneric {

    public options: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public configuration: configurationService, @Optional() public procurementdocrecord: procurementdocrecord) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        super.ngOnInit();

        this.getOptions();
    }

    public getValue(): string {
        try {
            if (!this.value) return '';

            // find the option and try to translate the table
            let thisOption = this.options.find(itemtype => itemtype.taxcategoryid == this.value);
            if (thisOption) {
                return thisOption.taxcategoryname;
            } else {
                return this.value;
            }
        } catch (e) {
            return this.value;
        }
    }

    public getOptions() {
        // get the companycode
        let companycode = this.configuration.getData('companycodes').find(c => c.id == this.procurementdocrecord.procurementDoc.getField('companycode_id'));

        // get all where the countery is int eh list of countries or the country is empty
        this.options = this.configuration.getData('procurementdoctaxcategories').filter(ct => !ct.country || ct.country.indexOf(companycode.country) >= 0);
    }
}
