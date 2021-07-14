/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    selector: 'field-full-name',
    templateUrl: './src/objectfields/templates/fieldfullname.html'
})
export class fieldFullName extends fieldGeneric {
    private isValid: boolean = true;
    private errorMessage: string = '';

    get fieldsalutation() {
        return this.fieldconfig.field_salutation ? this.fieldconfig.field_salutation : 'salutation';
    }

    get fielddegree() {
        return this.fieldconfig.field_degree ? this.fieldconfig.field_degree : 'degree1';
    }

    get fieldfirstname() {
        return this.fieldconfig.field_firstname ? this.fieldconfig.field_firstname : 'first_name';
    }

    get fieldlastname() {
        return this.fieldconfig.field_lastname ? this.fieldconfig.field_lastname : 'last_name';
    }

    get fieldlasttitle() {
        return this.fieldconfig.field_lasttitle ? this.fieldconfig.field_lasttitle : 'degree2';
    }

    get salutationdisplay() {
        return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldsalutation, this.model.data[this.fieldsalutation]);
    }

    get value() {
        return this.filterUndefined(this.language.getFieldDisplayOptionValue(this.model.module, this.fieldsalutation, this.model.data[this.fieldsalutation])) + ' ' + this.filterUndefined(this.model.data[this.fielddegree]) + ' ' + this.filterUndefined(this.model.data[this.fieldfirstname]) + ' ' + this.filterUndefined(this.model.data[this.fieldlastname]) + ' ' + this.filterUndefined(this.model.data[this.fieldlasttitle]);
    }


    get salutation() {
        return this.model.getField(this.fieldsalutation);
    }

    set salutation(value) {
        this.model.setField(this.fieldsalutation, value);
    }

    get degree1() {
        return this.model.getField(this.fielddegree);
    }

    set degree1(value) {
        this.model.setField(this.fielddegree, value);
    }

    get first_name() {
        return this.model.getField(this.fieldfirstname);
    }

    set first_name(value) {
        this.model.setField(this.fieldfirstname, value);
    }

    get last_name() {
        return this.model.getField(this.fieldlastname);
    }

    set last_name(value) {
        this.model.setField(this.fieldlastname, value);
    }

    get degree2() {
        return this.model.getField(this.fieldlasttitle);
    }

    set degree2(value) {
        this.model.setField(this.fieldlasttitle, value);
    }

    private filterUndefined(value) {
        return value ? value : '';
    }

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }

    /**
     * returns if the simple mode is set in the fieldconfig
     */
    get isSimple() {
        return this.fieldconfig.simple;
    }

    /**
     * determines the width of the fields based on the size of the view
     *
     * @param fieldname
     * @private
     */
    private getClassesForSubField(fieldname: string) {

        let fieldClass = '';

        switch (fieldname) {
            case this.fieldsalutation:
                fieldClass = this.view.size == 'small' ? 'slds-size--1-of-3 slds-order--1' : (this.isSimple ? 'slds-size--1-of-5' : 'slds-size--1-of-7');
                break;
            case this.fielddegree:
                fieldClass = this.view.size == 'small' ? 'slds-size--1-of-3 slds-order--2' : 'slds-size--1-of-7';
                break;
            case this.fieldlasttitle:
                fieldClass = this.view.size == 'small' ? 'slds-size--1-of-3 slds-order--3' : 'slds-size--1-of-7';
                break;
            case this.fieldfirstname:
                fieldClass = this.view.size == 'small' ? 'slds-size--1-of-2 slds-order--4' : (this.isSimple ? 'slds-p-left--xx-small slds-size--2-of-5' : 'slds-p-left--xx-small slds-size--2-of-7');
                break;
            case this.fieldlastname:
                fieldClass = this.view.size == 'small' ? 'slds-size--1-of-2 slds-order--5' : (this.isSimple ? 'slds-size--2-of-5' : 'slds-size--2-of-7');
                break;
        }

        if (this.getStati(fieldname).invalid) {
            fieldClass += ' slds-has-error';
        }

        return fieldClass;


    }

    private getSalutations(): any[] {
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.model.module, this.fieldconfig.field_salutation ? this.fieldconfig.field_salutation : 'salutation');
        for (let optionVal in options) {
            retArray.push({
                value: optionVal,
                display: options[optionVal]
            });
        }
        return retArray;
    }

}
