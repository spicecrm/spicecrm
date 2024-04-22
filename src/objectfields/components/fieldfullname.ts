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
import {userpreferences} from "../../services/userpreferences.service";

@Component({
    selector: 'field-full-name',
    templateUrl: '../templates/fieldfullname.html'
})
export class fieldFullName extends fieldGeneric {
    public isValid: boolean = true;
    public errorMessage: string = '';

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
        return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldsalutation, this.model.getField(this.fieldsalutation));
    }

    get value() {
        // return this.filterUndefined(this.language.getFieldDisplayOptionValue(this.model.module, this.fieldsalutation, this.model.getField(this.fieldsalutation))) + ' ' + this.filterUndefined(this.model.getField(this.fielddegree)) + ' ' + this.filterUndefined(this.model.getField(this.fieldfirstname)) + ' ' + this.filterUndefined(this.model.getField(this.fieldlastname)) + ' ' + this.filterUndefined(this.model.getField(this.fieldlasttitle));
        return this.filterUndefined(this.getNameFormat());
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

    public filterUndefined(value) {
        return value ? value : '';
    }

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public userpreferences:userpreferences) {
        super(model, view, language, metadata, router);

    }

    public getNameFormat() {
        const userPref = this.userpreferences.toUse.locale_name_format;
        const s = this.model.getField(this.fieldsalutation);
        const f = this.model.getField(this.fieldfirstname);
        const l = this.model.getField(this.fieldlastname);
        const d = this.model.getField(this.fielddegree);
        const a = this.model.getField(this.fieldlasttitle);
        if (this.userpreferences.toUse.locale_name_format === 's f l') {
            return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldsalutation, s) + ' ' + this.filterUndefined(f) + ' ' + this.filterUndefined(l);
        }
        else if (userPref === 'f l') {
            return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldfirstname, f + ' ' + this.filterUndefined(l));
        }
        else if (userPref === 's l') {
            return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldsalutation, s + ' ' + this.filterUndefined(l));
        }
        else if (userPref === 'l, s f') {
            return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldlastname, l + ', ' + this.filterUndefined(s) + ' ' + this.filterUndefined(f));
        }
        else if (userPref === 'l, f') {
            return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldlastname, l + ', ' + this.filterUndefined(f));
        }
        else if (userPref === 's l, f') {
            return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldsalutation, s) + ' ' + this.filterUndefined(l) + ', ' + this.filterUndefined(f);
        }
        else if (userPref === 'l s f') {
            return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldlastname, l + ' ' + this.filterUndefined(s) + ' ' + this.filterUndefined(f));
        }
        else if (userPref === 'l f s') {
            return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldlastname, l + ' ' + this.filterUndefined(f) + ' ' + this.filterUndefined(s));
        }
        else if (userPref === 's d f l a') {
            return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldsalutation, s) + ' ' + this.filterUndefined(d) + ' ' + this.filterUndefined(f) + ' ' + this.filterUndefined(l) + ' ' + this.filterUndefined(a);
        }
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
    public getClassesForSubField(fieldname: string) {

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

    public getSalutations(): any[] {
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
