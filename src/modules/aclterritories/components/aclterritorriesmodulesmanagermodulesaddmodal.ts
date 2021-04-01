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
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {metadata} from '../../../services/metadata.service';
import {language} from "../../../services/language.service";

@Component({
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmodulesmanagermodulesaddmodal.html',
})
export class ACLTerritorriesModulesmanagerModulesAddModal implements OnInit{

    self: any = {};

    @Input() types: Array<any> = [];
    @Input() modules: Array<any> = [];

    module: string = '';
    managedModules = [];
    availablemodules: Array<string> = [];
    spiceaclterritorytype_id: string = '';
    relatefrom: string = '';
    @Output() newmodule: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private language: language, private metadata: metadata) {

    }

    ngOnInit(){
        for(let managedModule of this.modules){
            this.managedModules.push(managedModule.module);
        }

        let modules = this.metadata.getModules();
        for(let module of modules){
            if(this.managedModules.indexOf(module) < 0){
                this.availablemodules.push(module);
            }
        }

        this.availablemodules.sort();
    }

    get linkedfields(){
        let links = [];
        let fields = this.metadata.getModuleFields(this.module);
        for( let field in fields){
            if(fields[field].type == 'link' && this.managedModules.indexOf(fields[field].module) >= 0){
                links.push({
                    name: fields[field].name,
                    display: this.language.getFieldDisplayName(this.module, fields[field].name)
                })
            }
        }
        return links;
    }

    setRelated(){
        let fields = this.metadata.getModuleFields(this.module);
        for( let field in fields){
            if(fields[field].name == this.relatefrom){
                this.modules.some(module => {
                    if(module.module == fields[field].module){
                        this.spiceaclterritorytype_id = module.spiceaclterritorytype_id;
                        return true;
                    }
                })
                return true;
            }
        }
    }

    close(){
        this.self.destroy();
    }

    save(){
        this.newmodule.emit({module: this.module, spiceaclterritorytype_id: this.spiceaclterritorytype_id, relatefrom: this.relatefrom});
        this.close();
    }

}