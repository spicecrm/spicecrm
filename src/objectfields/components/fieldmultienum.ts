import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-multienum',
    templateUrl: './app/objectfields/templates/fieldmultienum.html'
})
export class fieldMultienum extends fieldGeneric implements OnInit
{
    options: Array<any> = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
        super(model, view, language, metadata, router);
    }

    ngOnInit(){
        this.buildOptions();
    }

    get columns(){
        return this.fieldconfig.columns ? parseInt( this.fieldconfig.columns) : 4;
    }

    get displayCheckboxes(){
        return this.fieldconfig.displaycheckboxes ? true : false;
    }

    getValue(): String {
        //return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.model.data[this.fieldname]);
        let retArray = [];
        let values = this.getValueArray();
        for (let value of values)
        {
            let val = this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, value);
            if(val)
                retArray.push(val);
        }

        return retArray.join(', ');
    }

    getValueArray(): Array<any> {
        try {
            return this.model.data[this.fieldname].substring(1, this.model.data[this.fieldname].length - 1).split('^,^');
        }catch(e) {
            return [];
        }
    }

    buildOptions()
    {
        let options = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);

        let countEntries = 0;
        for (let item in options) {
            countEntries++;
        }

        let entriesPerRow = countEntries / this.columns;
        let row = 0;
        let rowArray = [];
        for (let optionVal in options) {
            rowArray.push({
                id: this.model.generateGuid(),
                value: optionVal,
                display: options[optionVal]
            });

            if (rowArray.length >= entriesPerRow) {
                this.options.push(rowArray);
                rowArray = [];
            }
        }

        // push what is left
        if (rowArray.length > 0)
            this.options.push(rowArray);

    }

}