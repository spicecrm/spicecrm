import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router}   from '@angular/router';
import {fieldEnum} from "./fieldenum";

@Component({
    selector: 'field-enum-modules',
    templateUrl: './app/objectfields/templates/fieldenum.html'
})
export class FieldEnumModulesComponent extends fieldEnum
{
    options: Array<any> = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    getValue(): String{
        return this.language.getModuleName(this.value,true);
    }

    ngOnInit(){
         this.getOptions();
    }

    getOptions()
    {
        let options = this.metadata.getModules();
        //console.log(options);
        for(let opt of options){
            //console.log(opt);
            this.options.push({
                value: opt,
                display: this.language.getModuleName(opt,true),
            })
        }
        this.options.sort((a, b) => {
            return a.display > b.display ? 1 : -1;
        });

        // set the first value if no value is set and we are in edit mode
        if(this.isEditMode() && this.options.length > 0 && !this.value)
            this.value = this.options[0].value;
    }

}