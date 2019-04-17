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