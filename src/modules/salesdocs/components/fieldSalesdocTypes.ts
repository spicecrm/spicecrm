/**
 * @module ObjectFields
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
    selector: 'field-enum',
    templateUrl: './src/modules/salesdocs/templates/fieldSalesdocTypes.html'
})
export class fieldSalesdocTypes extends fieldGeneric  {

    public options: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private configuration: configurationService) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        super.ngOnInit();

        this.getOptions();
    }

    public getValue(): string {
        return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.value);
    }

    public getOptions() {
        this.options = this.configuration.getData('salesdoctypes');
    }
}
