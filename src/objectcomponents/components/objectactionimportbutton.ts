import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-action-import-button',
    templateUrl: './src/objectcomponents/templates/objectactionimportbutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '(click)' : 'this.import()'
    },
    styles: [
        ':host {cursor:pointer;}'
    ]
})
export class ObjectActionImportButton {

    constructor( private language: language, private metadata: metadata, private model: model, private router: Router ) {

    }

    import(){
        this.router.navigate(['/module/' + this.model.module + '/import']);
    }

    canImport(){
        return this.metadata.checkModuleAcl(this.model.module, 'import');
    }
}