/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-url',
    templateUrl: '../templates/fieldurl.html'
})
export class fieldUrl extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get url() {
        if (!!this.fieldconfig.inputurl) {
            return this.fieldconfig.inputurl.replace( /https?\:\/\//, '');
        } else {
            return this.model.getField(this.fieldname) ? this.model.getField(this.fieldname).replace(/https?\:\/\//, '') : '';
        }

    }

    public navigateTo() {
        if (this.url != ''){
            window.open('//' + this.url, '_blank');
        }
    }

}
