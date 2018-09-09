import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-enum',
    templateUrl: './src/objectfields/templates/fieldenum.html'
})
export class fieldEnum extends fieldGeneric
{

    options: Array<any> = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    getValue(): String{
        return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.value);
    }

    ngOnInit(){
        this.getOptions();
    }

    getOptions()
    {
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
        for(let optionVal in options){
            retArray.push({
                value: optionVal,
                display: options[optionVal]
            })
        }
        this.options = retArray;

        /*
        // set the first value if no value is set and we are in edit mode
        if(this.isEditMode() && this.options.length > 0 && !this.value)
            this.value = this.options[0].value;
        */

    }

}