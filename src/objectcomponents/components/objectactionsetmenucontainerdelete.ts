import {
    Component, ElementRef, Renderer, Input, Output, OnDestroy, EventEmitter, ViewChild,
    ViewContainerRef, OnInit, AfterViewInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {helper} from '../../services/helper.service';

@Component({
    templateUrl: './app/objectcomponents/templates/objectactionsetmenucontainerdelete.html',
})
export class ObjectActionsetMenuContainerDelete {

    constructor(private language: language, private model: model, private helper: helper) {

    }



    doAction(){
        if(!this.model.checkAccess('delete'))
            return;

        // this.showDialog = true;
        this.helper.confirm(this.language.getLabel('LBL_DELETE_RECORD'), this.language.getLabel('MSG_DELETE_CONFIRM')).subscribe(answer =>{
            if(answer){
                this.model.delete();
            }
        });
    }

}