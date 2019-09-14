/**
 * @module ModuleSalesDocs
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {configurationService} from '../../../services/configuration.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

import {Router} from '@angular/router';

@Component({
    selector: 'field-salesdoc-types',
    templateUrl: './src/modules/salesdocs/templates/fieldsalesdoctypes.html'
})
export class fieldSalesdocTypes extends fieldGeneric {

    public options: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private configuration: configurationService) {
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
            let thisOption = this.options.find(itemtype => itemtype.name == this.value);
            if (thisOption && thisOption.vname) {
                return this.language.getLabel(thisOption.vname);
            } else {
                return this.value;
            }
        } catch (e) {
            return this.value;
        }
    }

    /**
     * loads the salesdoc types from the config
     *
     * if config setting without display only is set filter the document out that are display ony .. this is required for the creation of sales documents
     */
    public getOptions() {
        let salesdocTypes = this.configuration.getData('salesdoctypes');

        if(this.fieldconfig.withoutdisplayonly){
            this.options = salesdocTypes.filter(salesdocType => salesdocType.displayonly != 0);
        } else {
            this.options = salesdocTypes;
        }
    }
}
