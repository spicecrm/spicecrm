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
    selector: 'field-multiple-enum-dropdown',
    templateUrl: './src/objectfields/templates/fieldmultipleenumdropdown.html'
})
export class fieldMultipleEnumDropdown extends fieldGeneric {
    private valuearray: any[] = [];
    private viewmodevalue: string = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
        super(model, view, language, metadata, router);
    }

    get listItems() {
        return this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
    }

    get viewModeValue() {
        if (this.viewmodevalue.length == 0 && this.value) {
            let languageOptions = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
            this.viewmodevalue = this.fieldValueArray.map(item => languageOptions[item]).join(', ');
        }
        return this.viewmodevalue;
    }

    private setFieldValue(valueArray) {
        window.console.log(valueArray);
        this.value = valueArray.map(item => `^${item}^`).join(',');
    }

    get fieldValueArray() {
        if (this.valuearray.length == 0 && this.value) {
            return this.valuearray = this.value.replace(/\^/g, '').split(',');
        }
        return this.valuearray;
    }
}

