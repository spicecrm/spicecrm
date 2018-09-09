import {Component, ElementRef, Renderer} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-title',
    templateUrl: './app/objectfields/templates/fieldtitle.html'
})
export class fieldTitle extends fieldGeneric {
    private isValid: boolean = true;
    errorMessage: String = '';

    get fielddd() {
        return this.fieldconfig['field_dd'] ? this.fieldconfig['field_dd'] : 'title_dd';
    }

    get fieldtxt() {
        return this.fieldconfig['field_txt'] ? this.fieldconfig['field_txt'] : 'title';
    }

    get titledddisplay() {
        return this.language.getFieldDisplayOptionValue(this.model.module, this.fielddd, this.model.data[this.fielddd]);
    }

    get value(){
        return (this.model.data[this.fielddd] ? this.language.getFieldDisplayOptionValue(this.model.module, this.fielddd, this.model.data[this.fielddd]) : '') +
            (this.model.data[this.fieldtxt] ? ' ' + this.model.data[this.fieldtxt] : '');
    }

    /*
     constructor(private el: ElementRef, private model: model, private view: view, private language: language, private metadata: metadata) {
     }
     */
    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }

    // overwrite get Field Class
    getFieldClass() {
        let classes: Array<string> = [];
        if (!this.isValid) classes.push('slds-has-error');
        return classes;
    }

    getTitles(): Array<any>{
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.model.module, this.fieldconfig['field_dd'] ? this.fieldconfig['field_dd'] : 'title_dd');
        for(let optionVal in options){
            retArray.push({
                value: optionVal,
                display: options[optionVal]
            })
        }
        return retArray;
    }

}