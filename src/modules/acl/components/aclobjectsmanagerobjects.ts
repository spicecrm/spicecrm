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
    EventEmitter
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'aclobjects-manager-objects',
    templateUrl: './src/modules/acl/templates/aclobjectsmanagerobjects.html',
})
export class ACLObjectsManagerObjects {

    @ViewChild('header', {read: ViewContainerRef, static: true}) header: ViewContainerRef;

    loading: boolean = false;

    acltypes: Array<any> = [];
    activeTypeId: String = '';

    aclobjects: Array<any> = [];
    activeObjectId: String = '';
    searchterm: String = '';

    @Output() objectselected: EventEmitter<any> = new EventEmitter<any>();
    @Output() typeselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private language: language) {

        this.backend.getRequest('spiceaclobjects/authtypes').subscribe(acltypes => {
            this.acltypes = acltypes;

            this.acltypes.sort((a, b) => {
                return a.module > b.module ? 1 : -1;
            });
        });


    }

    private keyUp(_e) {
        switch (_e.key) {
            case 'Enter':
                this.getObjects();
                break;
        }
    }

    private getObjects() {
        this.loading = true;
        this.aclobjects = [];

        let params = {
            sysmodule_id: this.activeTypeId,
            searchterm: this.searchterm
        };

        this.backend.getRequest('spiceaclobjects', params).subscribe(aclobjects => {
            this.aclobjects = aclobjects;

            this.aclobjects.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });
            this.loading = false;
        });
    }

    get contentStyle() {
        let rect = this.header.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + rect.height + 'px)'
        };
    }

    private getType(type) {
        return this.language.getFieldDisplayOptionValue('SpiceACLObjects', 'spiceaclobjecttype', type);
    }

    private selectType(event) {
        this.getObjects();

        // reset the selected object
        this.activeObjectId = '';
        this.objectselected.emit(this.activeObjectId);

        // emit the type
        this.typeselected.emit(this.activeTypeId);
    }

    private addObject() {
        this.modal.openModal('ACLObjectsManagerAddObjectModal').subscribe(modalRef => {
            modalRef.instance.sysmodule_id = this.activeTypeId;
            modalRef.instance.newObjectData.subscribe(modelData => {
                if (modelData) {
                    this.aclobjects.push(modelData);
                    this.selectObject(modelData);
                }
            });
        });
    }

    private addDefaultObjects() {
        if(this.aclobjects.length == 0 && this.activeTypeId) {
            this.loading = true;

            let params = {
                sysmodule_id: this.activeTypeId,
                sysmodule_name: this.acltypes.find(x => x.id == this.activeTypeId).module
            };
            this.backend.postRequest('spiceaclobjects/createdefaultobjects', params).subscribe(aclobjects => {
                this.getObjects();
                this.loading = false;
            });
        }
    }

    private selectObject(aclobject) {
        this.activeObjectId = aclobject.id;

        this.objectselected.emit(this.activeObjectId);
    }

    private activateObject(objectid) {
        this.backend.postRequest('spiceaclobjects/activation/' + objectid).subscribe(response => {
            this.aclobjects.some(object => {
                if (object.id == objectid) {
                    object.status = 'r';
                    return true;
                }
            });
        });
    }

    private deactivateObject(objectid) {
        this.backend.deleteRequest('spiceaclobjects/activation/' + objectid).subscribe(response => {
            this.aclobjects.some(object => {
                if (object.id == objectid) {
                    object.status = 'd';
                    return true;
                }
            });
        });
    }
}
