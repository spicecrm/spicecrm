/**
 * @module WorkbenchModule
 */
import {Component, Pipe} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {modal} from "../../services/modal.service";
import {ObjectRepositoryManagerAddRepo} from "./objectrepositorymanageraddrepo";
import {modelutilities} from "../../services/modelutilities.service";
import {configurationService} from "../../services/configuration.service";
import {view} from "../../services/view.service";

/*
* add a pipe to filter by the object
 */
@Pipe({name: 'objectrepositorymanagerfilter'})
export class ObjectRepositoryManagerFilter {
    private transform(values, filter) {
        if (!filter) {
            return values;
        }

        let retValues = [];
        for (let value of values) {
            if (value.object.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
                retValues.push(value);
            }
        }
        return retValues;
    }
}

// tslint:disable-next-line:max-classes-per-file
@Component({
    templateUrl: './src/workbench/templates/objectrepositorymanager.html',
    providers: [view]
})
export class ObjectRepositoryManager {
    public treelist: any[] = [];
    // editable
    public edit_mode: string = "custom";
    public change_request_required: boolean = false;
    public crNoneActive: boolean = false;
    private moduleReposSelect: any[] = [];
    private moduleRepos: any[] = [];
    private modulereposselecteditem: any = {};
    private objrepoList: any[] = [];
    private configList: any = {};
    private currentConfigArray: any[] = [];
    private objectFilter: string = '';
    public fieldTypeList: any[] = ["string", "label", "boolean", "fieldset", "actionset", "componentset", "module", "modulefilter"];
    private newRepo: any = {};
    private emptyRepo: any = {
        component: "",
        componentconfig: "",
        description: "",
        id: "",
        module: "",
        object: "",
        package: ""
    };
    private currentModule: any = {};
    private newModule: any = {};
    private emptyModule: any = {
        id: "",
        module: "",
        path: "",
        description: "",
        package: "",
        version: "",
        scope: "custom"
    };
    private currentObjRepo: any = {};

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private modalservice: modal,
        private modelutilities: modelutilities,
        private modal: modal,
        private toast: toast,
        private configurationService: configurationService,
        private view: view
    ) {
        // get module repos
        this.backend.getRequest('configuration/configurator/entries/sysuimodulerepository').subscribe(modules => {

            for (let module of modules) {
                this.moduleRepos.push(module);
                let moduleRepos = {};
                moduleRepos = {
                    id: module.id,
                    name: module.module,
                    group: "global"
                };
                this.moduleReposSelect.push(moduleRepos);
            }
            this.moduleReposSelect = Object.assign([], this.moduleReposSelect);
        });

        this.backend.getRequest('configuration/configurator/entries/sysuicustommodulerepository').subscribe(modules => {
            for (let module of modules) {

                this.moduleRepos.push(module);
                let moduleObj = {};
                moduleObj = {
                    id: module.id,
                    name: module.module,
                    group: "custom"
                };
                this.moduleReposSelect.push(moduleObj);
            }
            this.moduleReposSelect = Object.assign([], this.moduleReposSelect);
        });
        this.checkMode();
    }

    set moduleReposSelectedItem(event) {
        this.modulereposselecteditem = event;

        if (event.group == 'global') {
            this.backend.getRequest('configuration/configurator/entries/sysuiobjectrepository').subscribe(orepos => {
                this.objrepoList = [];

                for (let orepo of orepos) {
                    if (event.id == orepo.module) {
                        this.objrepoList.push(orepo);
                    }
                }
            });
        } else if (event.group == 'custom') {
            this.backend.getRequest('configuration/configurator/entries/sysuicustomobjectrepository').subscribe(orepos => {
                this.objrepoList = [];

                for (let orepo of orepos) {
                    if (event.id == orepo.module) {
                        this.objrepoList.push(orepo);
                    }
                }
            });
        } else {
            console.error("Damaged item!");
        }

        this.objrepoList.sort((a, b) => {
            return a.object < b.object ? 1 : -1;
        });

        for (let module of this.moduleRepos) {
            if (module.id == event.id) {
                this.currentModule = module;
                this.currentModule.scope = event.group;
            }
        }
        this.checkMode();
    }

    get moduleReposSelectedItem() {
        return this.modulereposselecteditem;
    }

    public updateField(event) {
        this.currentObjRepo.description = event;
    }

    public updateDeprecated() {
        this.currentObjRepo.deprecated = (this.currentObjRepo.deprecated == '1') ? '0' : '1';
    }

    private checkMode() {
        this.edit_mode = this.configurationService.getCapabilityConfig('core').edit_mode;
        this.change_request_required = this.configurationService.getCapabilityConfig('systemdeployment').change_request_required;

        if (!(this.edit_mode == 'none' || this.edit_mode == 'custom' || this.edit_mode == 'all')) {
            this.edit_mode = 'custom';
        }

        if (this.change_request_required) {
            this.backend.getRequest('module/SystemDeploymentCRs/active').subscribe(crresponse => {
                if (crresponse.id == "") {
                    this.setNoneMode();
                    this.crNoneActive = true;
                    this.toast.sendToast(this.language.getLabel('LBL_ACTIVATE_CR_WARNING'), 'warning', null, 3);
                } else {
                    this.crNoneActive = false;
                    if (this.edit_mode == "all") {
                        this.setAllMode();
                    } else if (this.edit_mode == "custom") {
                        this.setCustomMode();
                    } else {
                        this.setNoneMode();
                    }
                }
            });
        } else {
            this.crNoneActive = false;
            if (this.edit_mode == "all") {
                this.setAllMode();
            } else if (this.edit_mode == "custom") {
                this.setCustomMode();
            } else {
                this.setNoneMode();
            }
        }
    }

    private setNoneMode() {
        this.view.setViewMode();
    }

    private setCustomMode() {
        if (this.currentModule.scope == "custom") {
            this.view.setEditMode();
        } else {
            this.view.setViewMode();
        }
    }

    private setAllMode() {
        this.view.setEditMode();
    }

    private clickObjRepo(cor) {
        this.currentObjRepo = cor;
        this.currentConfigArray = [];
        try {
            this.configList = JSON.parse(this.currentObjRepo.componentconfig);

            let counterId = 0;

            for (let name in this.configList) {
                if (this.configList.hasOwnProperty(name)) {
                    let desc;
                    if (this.configList[name].description) {
                        desc = this.configList[name].description;
                    } else {
                        desc = "";
                    }

                    let fieldConfig = {id: counterId, name: name, type: this.configList[name].type, description: desc};
                    this.currentConfigArray.push(fieldConfig);
                    counterId++;
                }
            }

        } catch (e) {
            console.warn("JSON is invalid or empty!");
        }


    }

    private checkCurrentObjRepo(id) {
        return this.currentObjRepo.id == id;

    }

    private addConfig() {
        this.currentConfigArray.push({id: this.currentConfigArray.length + 1, name: "", type: ""});
    }

    private deleteConfig(id) {
        this.currentConfigArray.splice(id, 1);
    }

    private saveChanges() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {

            let configObject = {};
            let currentConfigArrayCopy = [...this.currentConfigArray];
            let checkInput = true;
            for (let currentConfigItem of currentConfigArrayCopy) {
                if (currentConfigItem.type != "" && currentConfigItem.name != "") {
                    let typeObject = {};
                    let type_ind = 'type';
                    typeObject[type_ind] = currentConfigItem.type;

                    let desc_ind = 'description';
                    if (currentConfigItem.description) {
                        typeObject[desc_ind] = currentConfigItem.description;
                    } else {
                        typeObject[desc_ind] = "";
                    }

                    configObject[currentConfigItem.name] = typeObject;
                } else {
                    checkInput = false;
                }
            }
            if (checkInput) {
                this.currentObjRepo.componentconfig = JSON.stringify(configObject);

                let table = "";
                if (this.currentModule.scope == "global") {
                    table = "sysuiobjectrepository";
                } else {
                    table = "sysuicustomobjectrepository";
                }
                this.backend.postRequest('configuration/configurator/' + table + '/' + this.currentObjRepo.id, null, { config: this.currentObjRepo }).subscribe(
                    (success) => {
                        for (let i in this.objrepoList) {
                            if (this.objrepoList[i].id == this.currentObjRepo.id) {
                                this.objrepoList[i] = this.currentObjRepo;
                            }
                        }
                        loadingModalRef.instance.self.destroy();
                        this.toast.sendToast('changes saved');
                    }
                );
            } else {
                loadingModalRef.instance.self.destroy();
                this.toast.sendToast('Empty configuration!');
            }
        });
    }

    private addObjRepo() {
        this.modalservice.openModal('ObjectRepositoryManagerAddRepo').subscribe(modal => {

            this.newRepo = {...this.emptyRepo};
            modal.instance.objRepo = this.newRepo;

            modal.instance.closedialog.subscribe(added => {
                if (added) {
                    this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
                        this.newRepo.id = this.modelutilities.generateGuid(); // generate id
                        this.newRepo.module = this.currentModule.id;
                        let table = "";
                        if (this.currentModule.scope == "global") {
                            table = "sysuiobjectrepository";
                        } else {
                            table = "sysuicustomobjectrepository";
                        }
                        this.backend.postRequest('configuration/configurator/' + table + '/' + this.newRepo.id, null, { config: this.newRepo }).subscribe(
                            (success) => {
                                this.objrepoList.push(this.newRepo);
                                this.currentObjRepo = this.newRepo;
                                loadingModalRef.instance.self.destroy();
                                this.toast.sendToast('changes saved');
                            }
                        );
                    });
                }
            });
        });
    }

    private addModalRepo(mode = 'add') {
        this.modalservice.openModal('ObjectRepositoryManagerAddModule').subscribe(modal => {
            if (mode == 'edit') {
                this.newModule = {...this.currentModule};
                modal.instance.moduleRepo = this.newModule;
            } else {
                this.newModule = {...this.emptyModule};
                modal.instance.moduleRepo = this.newModule;
            }
            modal.instance.mode = mode;
            modal.instance.edit_mode = this.edit_mode;


            modal.instance.closedialog.subscribe(added => {
                if (added) {
                    this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
                        if (this.newModule.id == "") {
                            this.newModule.id = this.modelutilities.generateGuid(); // generate id
                        }
                        let table = "";
                        let scope = "";
                        if (this.newModule.scope == "global") {
                            table = "sysuimodulerepository";
                            scope = "global";
                        } else {
                            table = "sysuicustommodulerepository";
                            scope = "custom";
                        }
                        delete (this.newModule.scope);
                        this.backend.postRequest('configuration/configurator/' + table + '/' + this.newModule.id, null, { config: this.newModule }).subscribe(
                            (success) => {

                                let moduleRepoSelect = {
                                    id: this.newModule.id,
                                    name: this.newModule.module,
                                    group: scope
                                };
                                this.newModule.scope = scope;
                                if (mode == 'add') {
                                    this.moduleReposSelect.push(moduleRepoSelect);
                                    this.moduleRepos.push(this.newModule);
                                    this.moduleReposSelectedItem = moduleRepoSelect;
                                } else {
                                    for (let index in this.moduleReposSelect) {
                                        if (this.moduleReposSelect[index].id == moduleRepoSelect.id) {
                                            this.moduleReposSelect[index] = moduleRepoSelect;
                                        }
                                    }
                                    for (let moduleRepo of this.moduleRepos) {
                                        if (moduleRepo.id == this.newModule.id) {
                                            moduleRepo = this.newModule;
                                        }
                                    }
                                }
                                this.currentModule = this.newModule;
                                this.moduleReposSelect = Object.assign([], this.moduleReposSelect);
                                this.moduleReposSelectedItem = moduleRepoSelect;
                                loadingModalRef.instance.self.destroy();
                                this.toast.sendToast('changes saved');
                            }
                        );
                    });
                }
            });
        });
    }

    private editModalRepo() {
        this.addModalRepo('edit');
    }

    private exportRepoList() {
        this.modalservice.openModal('ObjectRepositoryExport');
    }

    private getDeprecatedBool(dep) {
        return dep == '1';
    }

}
