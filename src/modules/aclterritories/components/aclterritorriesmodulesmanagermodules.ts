/**
 * @module ModuleACLTerritories
 */
import {Component} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';

@Component({
    selector: 'aclterritorries-modulesmanager-modules',
    templateUrl: '../templates/aclterritorriesmodulesmanagermodules.html',
})
export class ACLTerritorriesModulesmanagerModules {

    public loading: boolean = false;
    public modules: any[] = [];
    public types: any[] = [];

    constructor(public backend: backend, public modal: modal, public language: language, public modelutilities: modelutilities) {
        this.loadModules();
    }

    public loadModules() {
        this.loading = true;
        // get the types
        this.backend.getRequest('module/SpiceACLTerritories/core/territorytypes').subscribe(types => {
            this.types = types;
        });

        // get the modules
        this.backend.getRequest('module/SpiceACLTerritories/core/territorytypesmodules').subscribe(modules => {
            this.loading = false;
            for(let module of modules) {
                this.modules.push({
                    module: module.module,
                    spiceaclterritorytype_id: module.spiceaclterritorytype_id,
                    relatefrom: module.relatefrom,
                    multipleobjects: module.multipleobjects == '1' ? 1 : 0,
                    multipleusers: module.multipleusers == '1' ? 1 : 0,
                    suppresspanel: module.suppresspanel == '1' ? 1 : 0
                });
            }

            this.modules.sort((a, b) => {
                return a.module > b.module ? 1 : -1;
            });
        });
    }

    public getTypeName(typeid) {
        for(let type of this.types) {
            if(type.id == typeid) {
                return type.name;
            }
        }

        return typeid;
    }

    public updateModule(module) {
        this.backend.postRequest('module/SpiceACLTerritories/core/territorytypesmodules/' + module.module, {}, module);
    }

    public deleteModule(module) {
        this.modal.confirm('Delete Module', 'Delete').subscribe(response => {
            if(response) {
                this.backend.deleteRequest('module/SpiceACLTerritories/core/territorytypesmodules/'+module.module).subscribe(success => {
                    this.modules.some((thismodule, index) => {
                        if(thismodule.module == module.module) {
                            this.modules.splice(index, 1);
                            return true;
                        }
                    });
                });
            }
        });
    }

    public addModule() {
        this.modal.openModal('ACLTerritorriesModulesmanagerModulesAddModal').subscribe(modalRef => {
            modalRef.instance.types = this.types;
            modalRef.instance.modules = this.modules;

            modalRef.instance.newmodule.subscribe(newModule => {

                newModule.multipleobjects = 0;
                newModule.multipleusers = 0;
                newModule.suppresspanel = 0;

                this.updateModule(newModule);

                this.modules.push(newModule);
            });
        });
    }
}
