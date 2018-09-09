import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnChanges, OnInit, EventEmitter, OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'salesdocs-items-container',
    templateUrl: './app/modules/salesdocs/templates/salesdocsitemscontainer.html'
})
export class SalesDocsItemsContainer  {

    expanded: boolean = true;

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private model: model, private view: view) {

    }

    get editing(){
        return this.view.isEditMode();
    }

}