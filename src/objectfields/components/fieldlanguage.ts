import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-enum',
    templateUrl: './app/objectfields/templates/fieldlanguage.html'
})
export class fieldLanguage extends fieldGeneric implements OnInit
{

    options: Array<any> = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    getValue(): String{
        for(let language of this.options){
            if(language.value == this.value){
                return language.display;
            }
        };

        return this.value;

    }

    ngOnInit(){
         this.getOptions();
    }

    getOptions()
    {
        for(let language of this.language.getAvialableLanguages()){
            this.options.push({
                value: language.language,
                display: language.text
            });
        }
    }

}