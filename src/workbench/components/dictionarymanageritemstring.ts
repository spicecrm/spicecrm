import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {backend} from '../../services/backend.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'dictionarymanager-item-string',
    templateUrl: './app/workbench/templates/dictionarymanageritemstring.html'
})
export class DictionaryManagerItemString{

    @Input() entry: any = {};
    @Input() field: any = {};

    constructor(private view: view) {
    }

    isEditMode(){
        return this.view.isEditMode();
    }

}