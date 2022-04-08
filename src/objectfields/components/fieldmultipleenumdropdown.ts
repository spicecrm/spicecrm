/**
 * @module ObjectFields
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-multiple-enum-dropdown',
    templateUrl: '../templates/fieldmultipleenumdropdown.html'
})
export class fieldMultipleEnumDropdown extends fieldGeneric implements OnInit, OnDestroy {
    public valueArray = [];
    public viewModeValueText = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
        super(model, view, language, metadata, router);

    }

    public ngOnInit() {
        this.setSubscriptions();
    }

    /**
     * Detect Changes
     */
    public setSubscriptions() {
        this.subscriptions.add(
            // Detect changement of model data.
            this.model.data$.subscribe(
                () => {
                    this.createValueArray();
                    this.createViewModeValueText();
                }
            )
        );
        this.subscriptions.add(
            // Detect changement of the current language to change the selected options (in view mode).
            this.language.currentlanguage$.subscribe( () => {
                this.createViewModeValueText();
            })
        );
    }

    /**
     * Provide the possible options for the select field.
     */
    get listItems() {
        return this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
    }

    /**
     * Set the value field with the selected options delivered from systemmultipleselect.
     */
    public setFieldValue(valueArray) {
        this.value = valueArray.map(item => `^${item}^`).join(',');
        this.createValueArray();
        this.createViewModeValueText();
    }

    /**
     * Create the array of selected options, from the field "value" (type text).
     */
    public createValueArray() {
        this.valueArray = this.value ? this.value.replace(/\^/g, '').split(',') : [];
    }

    /**
     * Create the text variant of the selected options.
     */
    public createViewModeValueText() {
        let languageOptions = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
        this.viewModeValueText = this.valueArray.map( item => languageOptions[item]).join(', ');
    }

    /**
     * Display the options grouped? Default (undefined) is true, for backward compatibility reasons.
     */
    get grouped() {
        return ( this.fieldconfig.grouped === undefined || this.fieldconfig.grouped === true ) ? true : false;
    }

    /**
     * unsubscribe from various subscriptions on destroy
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}

