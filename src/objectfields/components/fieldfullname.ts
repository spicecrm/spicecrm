import {Component, ElementRef, Renderer} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-full-name',
    templateUrl: './src/objectfields/templates/fieldfullname.html'
})
export class fieldFullName extends fieldGeneric {
    private isValid: boolean = true;
    errorMessage: String = '';

    get fieldsalutation() {
        return this.fieldconfig['field_salutation'] ? this.fieldconfig['field_salutation'] : 'salutation';
    }

    get fielddegree() {
        return this.fieldconfig['field_degree'] ? this.fieldconfig['field_degree'] : 'degree1';
    }

    get fieldfirstname() {
        return this.fieldconfig['field_firstname'] ? this.fieldconfig['field_firstname'] : 'first_name';
    }

    get fieldlastname() {
        return this.fieldconfig['field_lastname'] ? this.fieldconfig['field_lastname'] : 'last_name';
    }

    get fieldlasttitle() {
        return this.fieldconfig['field_lasttitle'] ? this.fieldconfig['field_lasttitle'] : 'degree2';
    }

    get salutationdisplay() {
        return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldsalutation, this.model.data[this.fieldsalutation]);
    }

    get value(){
        return this.filterUndefined(this.language.getFieldDisplayOptionValue(this.model.module, this.fieldsalutation, this.model.data[this.fieldsalutation])) + ' ' + this.filterUndefined(this.model.data[this.fielddegree]) + ' ' + this.filterUndefined(this.model.data[this.fieldfirstname]) + ' ' + this.filterUndefined(this.model.data[this.fieldlastname]) + ' ' + this.filterUndefined(this.model.data[this.fieldlasttitle]);
    }

    filterUndefined(value){
        return value ? value : '';
    }

    /*
     constructor(private el: ElementRef, private model: model, private view: view, private language: language, private metadata: metadata) {
     }
     */
    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }

    /*
    // overwrite get Field Class
    getFieldClass() {
        let classes: Array<string> = [];
        if (!this.isValid) classes.push('slds-has-error');
        return classes;
    }
    */
    getClassesForSubField( fieldname: string ) {
        if( this.getStati( fieldname ).invalid ) {
            return 'slds-has-error';
        }
    }

    getSalutations(): Array<any>{
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.model.module, this.fieldconfig['field_salutation'] ? this.fieldconfig['field_salutation'] : 'salutation');
        for(let optionVal in options){
            retArray.push({
                value: optionVal,
                display: options[optionVal]
            })
        }
        return retArray;
    }

}