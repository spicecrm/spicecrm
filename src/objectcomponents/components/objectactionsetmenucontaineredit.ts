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
    selector: 'object-actionset-menu-container-edit',
    templateUrl: './src/objectcomponents/templates/objectactionsetmenucontaineredit.html',
})
export class ObjectActionsetMenuContainerEdit {

    constructor(private language: language, private model: model) {

    }

    doAction(){
        if(!this.model.checkAccess('edit'))
            return;

        this.model.edit(true);
    }

}