import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-enum',
    templateUrl: './src/objectfields/templates/fieldColorEnum.html'
})
export class fieldColorEnum extends fieldGeneric
{

    longOptions: Array<any> = [];
    options: Array<any> = [];
    colors: Array<any> = [];


    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    getValue(): String {
        for(let opt of this.options) {
            if(opt.value == this.value){
                return opt.display;
            }
        }
    }

    getColor(): String {
        if(this.colors[this.value]) {
            return this.colors[this.value];
        }else {
            return 'transparent';
        }
    }

    ngOnInit(){
        this.getOptions();
    }

    getOptions()
    {
        this.longOptions = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
        let options = {...this.longOptions};

        if(!options || this.fieldconfig.useShort){
            options = this.language.getDisplayOptions(this.fieldconfig.shortEnum);
        }

        this.colors = this.language.getDisplayOptions(this.fieldconfig.colorEnum);

        let retArray = [];

        for (let optionVal in options) {

            retArray.push({
                value: optionVal,
                color: this.colors[optionVal],
                display: options[optionVal],
                long: this.longOptions[optionVal]
            })
        }
        this.options = retArray;
        
    }

}