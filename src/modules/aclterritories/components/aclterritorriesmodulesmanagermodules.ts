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
 * @module ModuleACLTerritories
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';

@Component({
    selector: 'aclterritorries-modulesmanager-modules',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmodulesmanagermodules.html',
})
export class ACLTerritorriesModulesmanagerModules {

    loading: boolean = false;
    modules: Array<any> = [];
    types: Array<any> = [];

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {
        this.loadModules();
    }

    loadModules(){
        this.loading = true;
        // get the types
        this.backend.getRequest('spiceaclterritories/core/orgobjecttypes').subscribe(types => {
            this.types = types;
        })

        // get the modules
        this.backend.getRequest('spiceaclterritories/core/orgobjecttypemodules').subscribe(modules => {
            this.loading = false;
            for(let module of modules){
                this.modules.push({
                    module: module.module,
                    spiceaclterritorytype_id: module.spiceaclterritorytype_id,
                    relatefrom: module.relatefrom,
                    multipleobjects: module.multipleobjects == '1' ? true : false,
                    multipleusers: module.multipleusers == '1' ? true : false,
                    suppresspanel: module.suppresspanel == '1' ? true : false
                })
            }

            this.modules.sort((a, b) => {
                return a.module > b.module ? 1 : -1;
            })
        })
    }

    getTypeName(typeid){
        for(let type of this.types){
            if(type.id == typeid){
                return type.name;
            }
        }

        return typeid;
    }

    updateModule(module){
        this.backend.postRequest('spiceaclterritories/core/orgobjecttypemodules', {}, module);
    }

    deleteModule(module){
        this.modal.confirm('Delete Module', 'Delete').subscribe(response => {
            if(response){
                this.backend.deleteRequest('spiceaclterritories/core/orgobjecttypemodules/'+module.module).subscribe(success => {
                    this.modules.some((thismodule, index) => {
                        if(thismodule.module == module.module){
                            this.modules.splice(index, 1);
                            return true;
                        }
                    })
                })
            }
        })
    }

    addModule(){
        this.modal.openModal('ACLTerritorriesModulesmanagerModulesAddModal').subscribe(modalRef => {
            modalRef.instance.types = this.types;
            modalRef.instance.modules = this.modules;

            modalRef.instance.newmodule.subscribe(newModule => {

                newModule.multipleobjects = false;
                newModule.multipleusers = false;
                newModule.suppresspanel = false;

                this.updateModule(newModule);

                this.modules.push(newModule);
            })
        })
    }
}