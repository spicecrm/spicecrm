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
    Input,
    OnChanges
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';

@Component({
    templateUrl: './src/modules/acl/templates/aclprofilesmanageraddobjectmodal.html',
    providers: [model]
})
export class ACLProfilesManagerAddObjectModal {

    @ViewChild('header', {read: ViewContainerRef, static: true}) public header: ViewContainerRef;

    public self: any = {};
    public acltypes: any[] = [];
    public aclobjects: any[] = [];
    public activeTypeId: string = '';
    public activeObjectId: string = '';
    public searchterm: string = '';
    public loading: boolean = false;

    @Output() public aclobject: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private backend: backend) {
        this.backend.getRequest('module/SpiceACLObjects/modules').subscribe(acltypes => {
            this.acltypes = acltypes;

            this.acltypes.sort((a, b) => {
                return a.module > b.module ? 1 : -1;
            });
        });
    }

    public keyUp(_e) {
        switch (_e.key) {
            case 'Enter':
                this.getObjects();
                break;
        }
    }

    public getObjects() {
        this.loading = true;
        this.aclobjects = [];

        let params = {
            moduleid: this.activeTypeId,
            searchterm: this.searchterm
        };

        this.backend.getRequest('module/SpiceACLObjects', params).subscribe(aclobjects => {
            this.aclobjects = aclobjects;

            this.aclobjects.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });
            this.loading = false;
        });
    }

    public getType(type) {
        return this.language.getFieldDisplayOptionValue('SpiceACLObjects', 'spiceaclobjecttype', type);
    }

    public selectType(event) {
        this.getObjects();
        this.activeObjectId = '';
    }

    get currentModule() {
        for(let acltype of this.acltypes) {
            if(acltype.id == this.activeTypeId) {
                return acltype.module;
            }
        }

        return '';
    }

    public selectObject(aclobject) {

        aclobject.spiceacltype_module = this.currentModule;
        this.aclobject.emit(aclobject);
        this.close();
    }

    public close() {
        this.self.destroy();
    }

}
