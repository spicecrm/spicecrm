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
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter,
    Input
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    selector: 'acltypes-manager-types-fields',
    templateUrl: './src/modules/acl/templates/acltypesmanagertypesfields.html',
})
export class ACLTypesManagerTypesFields {

    @Input() public authtypefields: any[] = [];
    @Input() public authtypemodule: string = '';

    @Output() public addfields: EventEmitter<any> = new EventEmitter<any>();
    @Output() public deletefield: EventEmitter<string> = new EventEmitter<string>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {

    }

    public addField() {

        // we want to hide every selected field (We can't add fields two times)
        for (let afield of this.authtypefields) {
            afield.hide = true;
        }
        this.modal.openModal('ACLTypesManagerTypesAddFields').subscribe(modalRef => {
            modalRef.instance.module = this.authtypemodule;
            modalRef.instance.currentfields = this.authtypefields;
            modalRef.instance.addfields.subscribe(fields => {

                if (fields) {
                    let newFields = [];
                    for (let sfield of fields) {
                        let already_selected = false;
                        for (let key in this.authtypefields) {
                            if(this.authtypefields[key].name == sfield) {
                                already_selected = true;
                            }
                        }
                        if(!already_selected) {
                            newFields.push(sfield);
                        }
                    }
                    this.addfields.emit(newFields);
                }

            });
        });
    }

    public deleteField(id) {
        this.modal.confirm( this.language.getLabel('MSG_DELETE_ACL_FIELD', '', 'long'), this.language.getLabel('MSG_DELETE_ACL_FIELD', '', 'default') ).subscribe( ( answer ) => {
            if(answer) {
                this.deletefield.emit(id);
            }
        });
    }

}
