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
    selector: '[dictionarymanager-item]',
    templateUrl: './src/workbench/templates/dictionarymanageritem.html',
    providers: [view]
})
export class DictionaryManagerItem{

    @Input() fields: Array<any> = [];
    @Input() entry: any = {};
    @Input() domains: any = {};

    constructor(private view: view) {
    }

    setEditMode(){
        this.view.setEditMode();
    }

    isEditMode(){
        return this.view.isEditMode();
    }

    setViewMode(){
        this.view.setViewMode();
    }

    save(){

    }

    delete(){

    }
}