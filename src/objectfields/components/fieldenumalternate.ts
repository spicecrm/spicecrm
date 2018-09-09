import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-enum-alternate',
    templateUrl: './src/objectfields/templates/fieldenumalternate.html'
})

export class fieldEnumAlternate extends fieldGeneric
{

    fieldId: string = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

        this.fieldId = model.generateGuid().replace('-', '');
    }

    getValue(): String{
        return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.model.data[this.fieldname]);
    }

    getOptions(): Array<any>{
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
        for(let optionVal in options){
            retArray.push({
                value: optionVal,
                display: options[optionVal]
            })
        }
        return retArray;
    }

    setValue(value){
        this.value = value; // not needed anymore? :o
    }
}