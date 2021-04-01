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
 * @module ModuleACL
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {modellist} from '../../../services/modellist.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from "../../../services/broadcast.service";


@Component({
    templateUrl: './src/modules/acl/templates/acltypesmanager.html',
})
export class ACLTypesManager {

    @ViewChild('managercontent', {read: ViewContainerRef, static: true}) elementmanagercontent: ViewContainerRef;
    activeType: any = {
        authtypeid: '',
        authtypemodule: '',
        authtypefields: {},
        authtypeactions:[]
    };
    activeModule: string = '';

    constructor(private backend: backend, private modelutilities: modelutilities, private elementRef: ElementRef) {

    }

    get contentStyle(){
        let rect = this.elementmanagercontent.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px'
        }
    }

    setType(acltype){
        this.activeType.authtypeid = acltype.id
        this.activeType.authtypemodule = acltype.module
        this.backend.getRequest('spiceaclobjects/authtypes/'+acltype.id).subscribe(typedata => {
            this.activeType.authtypefields = typedata.authtypefields ? typedata.authtypefields : [];
            this.activeType.authtypeactions = typedata.authtypeactions;

            // sort the arrays
            this.sortType();
        });
    }

    addFields(fields){
        for (let field of fields) {
            this.backend.postRequest('spiceaclobjects/authtypes/' + this.activeType.authtypeid + '/authtypefields/' + field).subscribe(fielddata => {
                this.activeType.authtypefields.push(fielddata)
                this.sortType();
            });
        }
    }
    deleteField(fieldid) {
        this.backend.deleteRequest('spiceaclobjects/authtypes/' + this.activeType.authtypeid + '/authtypefields/' + fieldid).subscribe(fielddata => {
            this.activeType.authtypefields.some((field, index) => {
                if (field.id == fieldid) {
                    this.activeType.authtypefields.splice(index, 1);
                    return true;
                }
            })
        })
    }
    addAction(action){
        this.backend.postRequest('spiceaclobjects/authtypes/'+this.activeType.authtypeid+'/authtypeactions/'+action).subscribe(actiondata => {
            this.activeType.authtypeactions.push(actiondata)
            this.sortType();
        })
    }
    deleteAction(actionid){
        this.backend.deleteRequest('spiceaclobjects/authtypes/'+this.activeType.authtypeid+'/authtypeactions/'+actionid).subscribe(fielddata => {
            this.activeType.authtypeactions.some((action, index) => {
                if(action.id == actionid){
                    this.activeType.authtypeactions.splice(index, 1);
                    return true;
                }
            })
        })
    }

    private sortType(){
        this.activeType.authtypefields.sort((a, b) => {
            return a.name > b.name;
        })
        this.activeType.authtypeactions.sort((a, b) => {
            return a.action > b.action;
        })
    }

}