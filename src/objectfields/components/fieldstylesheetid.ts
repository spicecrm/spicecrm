/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-stylesheetid',
    templateUrl: '../templates/fieldstylesheetid.html'
})
export class fieldStylesheetID extends fieldGeneric {

    public stylesheets: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

        this.stylesheets = this.metadata.getHtmlStylesheetNames();
    }

    public getValue(): string {
        if (this.value) {
            let foundItem = this.stylesheets.find(a => a.id == this.value);
            if (foundItem) {
                return foundItem.name;
            }
        }
        return this.value;
    }

}
