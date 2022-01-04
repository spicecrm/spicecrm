/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
 * Display the available system languages in a select list and handle setting the language field value.
 */
@Component({
    selector: 'field-enum',
    templateUrl: '../templates/fieldlanguage.html'
})
export class fieldLanguage extends fieldGeneric implements OnInit {
    /**
     * display value for the language
     */
    public displayValue: string = '';
    /**
     * system language possible options
     */
    public options: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }

    /**
     * get language options and subscribe to data changes
     */
    public ngOnInit() {
        super.ngOnInit();
        this.getOptions();
        this.subscribeToDataChanges();
    }

    /**
     * get language options
     */
    public getOptions() {
        this.options = this.language.getAvialableLanguages().map(language => ({
            value: language.language,
            display: language.text
        }));
        if (!!this.fieldconfig.canBeEmpty) {
            this.options.unshift({value: '', display: ''});
        }
    }

    /**
     * subscribe to model data change and set the value and the display value
     */
    public subscribeToDataChanges() {

        this.subscriptions.add(
            this.model.data$.subscribe(data => {

                if (!!data[this.fieldname] && this.value != data[this.fieldname]) {
                    this.value = data[this.fieldname];
                }
                if (this.displayValue != this.value) {
                    this.setDisplayValue();
                }
            })
        );
    }

    /**
     * set the display value
     */
    public setDisplayValue() {
        const lang = this.options.find(lang => lang.value == this.model.getField(this.fieldname));
        this.displayValue = lang?.display || '';
    }
}
