import { Component, Input, Optional, OnInit } from '@angular/core';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { relatedmodels } from '../../services/relatedmodels.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-action-newrelated-button',
    templateUrl: './app/objectcomponents/templates/objectactionnewbutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '[style.display]': 'getDisplay()',
        '(click)' : 'this.addModel()'
    },
    styles: [
        ':host {cursor:pointer;}'
    ],
    providers: [model]
})
export class ObjectActionNewrelatedButton implements OnInit{

    parent: any = {};

    constructor( private language: language, private metadata: metadata, private model: model, private relatedmodels: relatedmodels) {

    }

    addModel(){

        if(!this.parent.data.id)
            this.parent.data.id = this.parent.id;

        // make sure we have no idea so a new on gets issues
        this.model.id = '';

        // add the model
        this.model.addModel('', this.parent).subscribe(response => {
            if(response != false){
                this.relatedmodels.addItems([response]);
            }
        });
    }

    ngOnInit(){
        this.model.module = this.relatedmodels.relatedModule;
    }

    getDisplay() {
        if(!this.model.module || !this.metadata.checkModuleAcl(this.model.module, 'create'))
            return 'none';

        return 'inherit';
    }

}