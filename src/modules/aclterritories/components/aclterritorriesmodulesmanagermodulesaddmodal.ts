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