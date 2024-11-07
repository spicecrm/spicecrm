/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';
import {EnumDisplayOptionArray} from "../../services/language.service";

@Component({
    selector: 'field-title',
    templateUrl: '../templates/fieldtitle.html'
})
export class fieldTitle extends fieldGeneric implements OnInit {
    public isValid: boolean = true;
    errorMessage: String = '';
    public options: EnumDisplayOptionArray = [];

    get fielddd() {
        return this.fieldconfig['field_dd'] ? this.fieldconfig['field_dd'] : 'title_dd';
    }

    get fieldtxt() {
        return this.fieldconfig['field_txt'] ? this.fieldconfig['field_txt'] : 'title';
    }

    get value(){
        return (this.model.getField(this.fielddd) ? this.language.getFieldDisplayOptionValue(this.model.module, this.fielddd, this.model.getField(this.fielddd)) : '') +
            (this.model.getField(this.fieldtxt) ? ' ' + this.model.getField(this.fieldtxt) : '');
    }
    
    public ngOnInit() {
        super.ngOnInit();
        this.options = this.language.getFieldDisplayOptions(this.model.module, this.fieldconfig.field_dd ? this.fieldconfig.field_dd : 'title_dd', true);
    }

    // overwrite get Field Class
    public getFieldClass(): string[] {
        return !this.isValid ? ['slds-has-error'] : [];
    }
}
