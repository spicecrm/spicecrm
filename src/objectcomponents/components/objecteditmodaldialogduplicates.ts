
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnInit,

} from '@angular/core';

import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'object-edit-modal-dialog-duplicates',
    templateUrl: './app/objectcomponents/templates/objecteditmodaldialogduplicates.html'
})
export class ObjectEditModalDialogDuplicates implements OnInit{

    @Input() module: string = '';
    @Input() duplicates: Array<any> = [];
    fieldset: String = '';

    constructor(private model: model, private metadata: metadata, private language: language) {

    }

    ngOnInit(){
        let componentconfig = this.metadata.getComponentConfig('GlobalModalDialogDuplicates', this.model.module);
        this.fieldset = componentconfig.fieldset;
    }
}