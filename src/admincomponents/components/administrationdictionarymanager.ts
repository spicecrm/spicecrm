/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/admincomponents/templates/administrationdictionarymanageritemfield.html'
})
export class AdministrationDictionaryManagerItemField implements AfterViewInit, OnInit {
    @Input() field: string = "";
    @Input() id: string = "";
    @Input() inputvalue: any = "";
    editMode: boolean = false;

    constructor(private dictionary:dictionary) {

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
    templateUrl: './src/admincomponents/templates/administrationdictionarymanager.html',
    providers: [dictionary]
})
export class AdministrationDictionaryManager implements AfterViewInit {

    @Input() dictionaryitem: string = '';

    constructor(private dictionary:dictionary) {

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
    templateUrl: './src/admincomponents/templates/administrationdictionarymanageritem.html'
})
export class AdministrationDictionaryManagerItem implements AfterViewInit, OnInit {
    @Input() item: any = {};
    editMode: boolean = false;

    constructor(private dictionary:dictionary) {

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

