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
import {footer} from '../../services/footer.service';

@Component({
    selector: 'field-base64',
    templateUrl: '../templates/fieldbase64.html'
})
export class fieldBase64 extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public footer: footer) {
        super(model, view, language, metadata, router);
    }

    /*
    * @return fieldconfig.minheight: number | 150
    */
    get minHeight() {
        return !!this.fieldconfig.minheight ? this.fieldconfig.minheight : 150;
    }

    /*
    * @return fieldconfig.maxheight: number | 150
    */
    get maxHeight() {
        return !!this.fieldconfig.maxheight ? this.fieldconfig.maxheight : 500;
    }

    /*
     * @return true if the field is to be displayed truncated
     */
    get truncated() {
        return !!this.fieldconfig.truncate;
    }

    /*
     * @return decoded value: string
     */
    get displayValue() {
        try {
            return decodeURIComponent(window.atob(this.value));
        } catch (e) {
            return '';
        }
    }
}
