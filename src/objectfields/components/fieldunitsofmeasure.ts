/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {configurationService} from '../../services/configuration.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
 * renders a field that allows selection of currencies
 */
@Component({
    selector: 'field-units-of-measure',
    templateUrl: '../templates/fieldunitsofmeasure.html'
})
export class fieldUnitsOfMeasure extends fieldGeneric {

    public uoms: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public configuration: configurationService) {
        super(model, view, language, metadata, router);

        this.uoms = this.configuration.getData('uomunits');
    }

    public getUOMLabel() {
        if (this.value) {
            let uom = this.uoms.find(u => u.id == this.value);
            if (uom) return this.language.getLabel(uom.label);
        }

        // if no found return the value
        return this.value;

    }
}
