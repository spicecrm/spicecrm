/**
 * @module AdminComponentsModule
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import { dictionary } from '../services/dictionary.service';





@Component({
    selector: '[administration-dictionarymanager-item-field]',
    templateUrl: '../templates/administrationdictionarymanageritemfield.html'
})
export class AdministrationDictionaryManagerItemField implements AfterViewInit, OnInit {
    @Input() field: string = "";
    @Input() id: string = "";
    @Input() inputvalue: any = "";
    editMode: boolean = false;

    constructor(public dictionary:dictionary) {

    }

    get fieldvalue():any{
        /*let fieldvalue: any = "";
        console.log('getvalue',this.field,this.id,this.dictionary.data);
        this.dictionary.data.some((item,itemIndex) => {
            if(item.id === this.id){
                fieldvalue = item[this.field];
                return true;
            }
        });*/
        return this.inputvalue;
    }

    set fieldvalue(newvalue:any){

    }

    isEditMode(){
        return this.editMode;
    }

    setEditMode(){
        this.editMode = true;
    }

    closeEdit(){
        this.editMode = false;
    }

    ngAfterViewInit() {

    }

    ngOnInit(){

    }
}

@Component({
    selector: 'administration-dictionarymanager',
    templateUrl: '../templates/administrationdictionarymanager.html',
    providers: [dictionary]
})
export class AdministrationDictionaryManager implements AfterViewInit {

    @Input() dictionaryitem: string = '';

    constructor(public dictionary:dictionary) {

    }

    ngAfterViewInit() {
        this.dictionary.load(this.dictionaryitem).subscribe(response => {

        });
    }

    isEditMode() {

    }

    closeEditMode(){

    }

}

@Component({
    selector: '[administration-dictionarymanager-item]',
    templateUrl: '../templates/administrationdictionarymanageritem.html'
})
export class AdministrationDictionaryManagerItem implements AfterViewInit, OnInit {
    @Input() item: any = {};
    editMode: boolean = false;

    constructor(public dictionary:dictionary) {

    }

    isEditMode(){
        return this.editMode;
    }

    setEditMode(){
        this.editMode = true;
    }

    closeEdit(){
        this.editMode = false;
    }

    ngAfterViewInit() {

    }

    ngOnInit(){

    }
}

