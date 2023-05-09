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

@Component({
    selector: 'field-multienum',
    templateUrl: '../templates/fieldmultienum.html'
})
export class fieldMultienum extends fieldGeneric implements OnInit {
    public options: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
        super(model, view, language, metadata, router);
        this.subscriptions.add(this.language.currentlanguage$.subscribe((newlang) => {
            this.buildOptions();
        }));
    }

    public ngOnInit() {
        this.buildOptions();
    }

    get columns() {
        return this.fieldconfig.columns ? parseInt(this.fieldconfig.columns, 10) : 4;
    }

    get displayCheckboxes() {
        return this.fieldconfig.displaycheckboxes ? true : false;
    }

    public getValue(): string {
        let retArray = [];
        let values = this.getValueArray();
        for (let value of values) {
            let val = this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, value);
            if (val) retArray.push(val);
        }
        if (this.fieldconfig.sortdirection) {
            switch (this.fieldconfig.sortdirection.toLowerCase()) {
                case 'desc':
                    retArray.sort((a,b) => a.toLowerCase() < b.toLowerCase() ? 1 : -1);
                    break;
                case 'asc':
                    retArray.sort((a,b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1);
            }
        }

        return retArray.join(', ');
    }

    public getValueArray(): any[] {
        try {
            let value = this.model.getFieldValue(this.fieldname);
            // delete leading and trailing ^ if there is any
            if(value.substring(0, 1) == '^') value = value.substring(1, value.length - 1);
            return value.split('^,^');
        } catch (e) {
            return [];
        }
    }

    public buildOptions() {

        let retArray = [];

        // get the langiage options
        let options = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);

        for (let optionVal in options) {
            retArray.push({
                id: this.model.generateGuid(),
                value: optionVal,
                display: options[optionVal]
            });
        }
        this.options = retArray;
        if (this.fieldconfig.sortdirection) {
            switch (this.fieldconfig.sortdirection.toLowerCase()) {
                case 'desc':
                    this.options.sort((a,b) => a.display.toLowerCase() < b.display.toLowerCase() ? 1 : -1);
                    break;
                case 'asc':
                    this.options.sort((a,b) => a.display.toLowerCase() > b.display.toLowerCase() ? 1 : -1);
            }
        }
        let countEntries = 0;
        for (let item in this.options) {
            countEntries++;
        }

        // reset the options
        this.options = [];
        // build the rows
        let entriesPerRow = Math.round(countEntries / this.columns);
        let row = 0;
        let rowArray = [];

        for(let item of retArray){
            rowArray.push(item);

            // if () this.options.push(rowArray);
            if (rowArray.length >= entriesPerRow && row != this.columns -1) {
                this.options.push(rowArray);
                row++;
                rowArray = [];
            }
        }
        // for (let optionVal in this.options) {
        //     rowArray.push({
        //         id: this.model.generateGuid(),
        //         value: optionVal,
        //         display: this.options[optionVal]
        //     });
        //
        //     if (rowArray.length >= entriesPerRow) {
        //         this.options.push(rowArray);
        //         rowArray = [];
        //     }
        // }

        // push what is left
        if (row==this.columns||rowArray.length > 0) this.options.push(rowArray);

    }
}
