import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-enum',
    templateUrl: './app/objectfields/templates/fieldColorEnum.html'
})
export class fieldColorEnum extends fieldGeneric
{

    options: Array<any> = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    getValue(): String {

        var values = this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.value);
        if(values) {
            var parsedvalues = JSON.parse(values);
            return (parsedvalues.name);
        }
        // return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.value);
    }

    getColor(): String {

        var values = this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.value);
        if(values) {
            var parsedvalues = JSON.parse(values);
            return (parsedvalues.color);
        }
        // return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.value);
    }

    ngOnInit(){
        this.getOptions();
    }

    getOptions()
    {
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);

        if(options) {
            for (let optionVal in options) {
                var parsedoptionVal = JSON.parse(options[optionVal]);
                retArray.push({
                    value: optionVal,
                    color: parsedoptionVal.color,
                    display: parsedoptionVal.name
                })
            }
            this.options = retArray;
        }

        /*
        // set the first value if no value is set and we are in edit mode
        if(this.isEditMode() && this.options.length > 0 && !this.value)
            this.value = this.options[0].value;
        */

    }

}