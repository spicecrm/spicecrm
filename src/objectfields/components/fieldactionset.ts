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

/**
 * renders a field for the selection of an actionset
 */
@Component({
    templateUrl: '../templates/fieldactionset.html'
})
export class fieldActionset extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }


    get displayValue(): string {
        if(!this.value) return '';
        let actionset = this.metadata.getActionSet(this.value);
        return actionset ? actionset.name : '';
    }

}
