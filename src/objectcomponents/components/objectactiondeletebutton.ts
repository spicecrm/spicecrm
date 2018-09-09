import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { helper } from '../../services/helper.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-action-delete-button',
    templateUrl: './src/objectcomponents/templates/objectactiondeletebutton.html',
    providers: [helper],
    host: {
        'class': 'slds-button slds-button--neutral',
        '[style.display]': 'getDisplay()',
        '(click)' : 'confirmDelete()'
    },
    styles: [
        ':host >>> {cursor:pointer;}'
    ]
})
export class ObjectActionDeleteButton {

    constructor( private language: language, private metadata: metadata, private model: model, private router: Router, private helper: helper ) {

    }

    canDelete(){
        try{
            return this.model.data.acl.delete;
        } catch(e){
            return false;
        }
    }

    confirmDelete(){

        // this.showDialog = true;
        this.helper.confirm(this.language.getAppLanglabel('MSG_DELETE_RECORD'), this.language.getAppLanglabel('MSG_DELETE_RECORD', 'long')).subscribe(answer =>{
            if(answer){
                this.delete();
            }
        });
    }


    delete() {

        this.model.delete().subscribe(status => {
            this.router.navigate(['/module/' + this.model.module]);
        });
    }

    getDisplay() {
        if(this.model.data.acl && !this.model.data.acl.delete)
            return 'none';

        return this.model.isEditing ? 'none' : 'inherit';
    }

}