/**
 * @module WorkbenchModule
 */
import {
    Component, ViewChild, ViewContainerRef,
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


import {Subject} from 'rxjs';
import {modal} from "../../services/modal.service";
import {ModuleConfigAddDialog} from "./moduleconfigadddialog";
import {configurationService} from "../../services/configuration.service";
import {view} from "../../services/view.service";

@Component({
    templateUrl: './src/workbench/templates/moduleconfigmanager.html',
    providers: [view]
})
export class ModuleConfigManager {

    component: string = "";
    configValues: any = {};

    crActive: boolean = false;
    change_request_required: boolean = false;
    edit_mode: string = '';
    allowCopyButton: boolean = true;
    allowGlobalModal: boolean = false;

    sysModules: Array<any> = [];
    sysRoles: any = {};
    currentModule: string = '';
    currentComponent: any = '';
    selectedId: string = '';
    selectedComponent: any = {};

    newComponent: any = {};

    componentTree: Array<any> = [];
    currentTableActive: string = '';

    componentModuleList: Array<any> = [];


    treelist: Array<any> = [];

    private initialized: boolean = false;

    @ViewChild("treecontainer", {read: ViewContainerRef, static: true}) private treecontainer: ViewContainerRef;
    @ViewChild("addconfigcontainer", {read: ViewContainerRef, static: true}) private addconfigcontainer: ViewContainerRef;

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private toast: toast,
        private modalservice: modal,
        private configurationService: configurationService,
        private view: view,
        private modal: modal
    ) {
        // get roles
        this.backend.getRequest('configuration/configurator/entries/sysuiroles').subscribe(roles => {
            this.sysRoles['*'] = '*';
            for (let role of roles) {
                this.sysRoles[role.id] = role.name;
            }
        });

        this.backend.getRequest('system/spiceui/admin/modules').subscribe(modules => {
            this.sysModules = modules;

            this.initialized = true;

            this.currentModule = "*";
            this.selectedModule();
        });

        // view.setEditMode(); //quickfix
        this.checkMode();
    }

    get getAllowCopyButton() {
        if (Object.keys(this.selectedComponent).length === 0 && this.selectedComponent.constructor === Object) {
            return false;
        } else
            return this.allowCopyButton;
    }

    checkMode() {
        this.edit_mode = this.configurationService.getCapabilityConfig('core').edit_mode;
        this.change_request_required = this.configurationService.getCapabilityConfig('systemdeployment').change_request_required ? true : false;

        if (!(this.edit_mode == 'none' || this.edit_mode == 'custom' || this.edit_mode == 'all')) {
            this.edit_mode = 'custom';
        }

        if (this.change_request_required) {
            this.backend.getRequest('module/SystemDeploymentCRs/active').subscribe(crresponse => {
                if (crresponse.id == "") {
                    this.setNoneMode();
                    // this.crNoneActive = true;
                    this.toast.sendToast(this.language.getLabel('LBL_ACTIVATE_CR_WARNING'), 'warning', null, 3);
                } else {
                    // this.crNoneActive = false;
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
            // this.crNoneActive = false;
            if (this.edit_mode == "all") {
                this.setAllMode();
            } else if (this.edit_mode == "custom") {
                this.setCustomMode();
            } else {
                this.setNoneMode();
            }
        }
    }

    setNoneMode() {
        this.view.setViewMode();
        this.allowCopyButton = false;
    }

    setCustomMode() {

        if (this.currentTableActive == "custom" || this.currentTableActive == "default_custom") {
            this.view.setEditMode();
        } else {
            this.view.setViewMode();
        }
    }

    setAllMode() {
        this.allowGlobalModal = true;
        this.view.setEditMode();
    }


    selectedModule() {
        this.currentComponent = '';
        this.componentTree = [];
        this.selectedComponent = {};


        if (this.currentModule == "*") {
            if (this.currentTableActive == "default_custom") {
                this.loadDefaultCustom();
            } else {
                this.loadDefault();
            }
        } else {
            if (this.currentTableActive == "custom") {
                this.loadCustom();
            } else {
                this.loadGlobal();
            }
        }
    }

    loadGlobal() {

        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            this.selectedComponent = {};
            this.currentTableActive = "global";
            this.checkMode();
            if (this.currentModule != "*") {
                this.backend.getRequest('configuration/configurator/entries/sysuicomponentmoduleconf').subscribe(data => {
                    this.buildTreeList(data);
                    loadingModalRef.instance.self.destroy();
                });
            } else {
                this.loadDefault();
                loadingModalRef.instance.self.destroy();
            }
        });
    }

    loadCustom() {

        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            this.selectedComponent = {};
            this.currentTableActive = "custom";
            this.checkMode();
            if (this.currentModule != "*") {
                this.backend.getRequest('configuration/configurator/entries/sysuicustomcomponentmoduleconf').subscribe(data => {
                    this.buildTreeList(data);
                    loadingModalRef.instance.self.destroy();
                });
            } else {
                this.loadDefaultCustom()
                loadingModalRef.instance.self.destroy();
            }
        });
    }

    loadDefault() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            this.currentTableActive = "default";
            this.backend.getRequest('configuration/configurator/entries/sysuicomponentdefaultconf').subscribe(data => {
                this.buildTreeList(data);
                loadingModalRef.instance.self.destroy();
            });
        });
    }

    loadDefaultCustom() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            this.currentTableActive = "default_custom";
            this.backend.getRequest('configuration/configurator/entries/sysuicustomcomponentdefaultconf').subscribe(data => {
                this.buildTreeList(data);
                loadingModalRef.instance.self.destroy();
            });
        });
    }

    // buildTreeList(data) {
    //     let components = [];
    //     for (let entry of data) {
    //         if (entry.module == this.currentModule || this.currentModule == "default") {
    //
    //             this.componentModuleList.push(entry);
    //
    //             var exists = false;
    //
    //             for (let comp of components) {
    //                 if (comp.id == entry.id) {
    //                     exists = true;
    //                 }
    //             }
    //
    //             if (!exists) {
    //                 var childs = [];
    //                 for (let secentry of data) {
    //                     if (secentry.module == this.currentModule || this.currentModule == "default") {
    //                         if (secentry.component == entry.component && secentry.id != entry.id) {
    //                             childs.push(secentry);
    //                         }
    //                     }
    //                 }
    //
    //                 //Only one entry
    //                 if (childs.length < 1) {
    //                     components.push({
    //                         id: entry.id,
    //                         parent_id: null,
    //                         clickable: true,
    //                         name: entry.component
    //                     })
    //                 } else {
    //                     //Parent of entries
    //
    //                     childs.push(entry);
    //
    //                     components.push({
    //                         id: entry.component,
    //                         parent_id: null,
    //                         clickable: false,
    //                         name: entry.component
    //                     })
    //
    //                     for (let child of childs) {
    //
    //                         //Childs of entries
    //                         components.push({
    //                             id: child.id,
    //                             parent_id: child.component,
    //                             clickable: true,
    //                             name: child.role_id
    //                         })
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     this.treelist = components;
    //     return components;
    // }


    private buildTreeList(data) {

        let components = [];
        for (let entry of data) {
            if (entry.module == this.currentModule || this.currentModule == "*") {
                this.componentModuleList.push(entry);

                // Check if role name is available
                let role_name = this.checkRoleName(entry.role_id);

                let comp: any = {};

                comp = {
                    id: entry.id,
                    parent_id: entry.component,
                    clickable: true,
                    name: role_name
                }

                // new component is added
                if (this.newComponent) {
                    if (this.newComponent.id == entry.id) {
                        comp.selected = true;
                        this.selectedOutputItem(comp.id); // open new component
                    }
                }
                components.push(comp)

                // Check if component is parent
                let check = 0;
                for (let comps of components) {
                    if (entry.component == comps.id) {
                        check = 1;
                    }
                }

                if (check == 0) {

                    // Check if it is a deprecated object
                    let compName = entry.component;
                    if(this.metadata.getSystemComponents().length > 0 && this.metadata.getSystemComponents().find(x => x.component === entry.component)) {
                        if(this.metadata.getSystemComponents().find(x => x.component === entry.component).deprecated == "1") {
                            compName = compName + " | dep.";
                        }
                    }

                    components.push({
                        id: entry.component,
                        parent_id: null,
                        clickable: false,
                        name: compName
                    });
                }
            }
        }
        this.newComponent = {};
        // sort by name
        components.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });
        this.treelist = components;
        return components;
    }


    checkRoleName(role_id) {
        let role_name = "";
        if (this.sysRoles[role_id]) {
            role_name = this.sysRoles[role_id];
        } else {
            role_name = role_id;
        }
        return role_name; // return name if available ... otherwise role id
    }

    selectedOutputItem(id) {
        for (let component of this.componentModuleList) {
            if (component.id == id) {
                if (typeof component.componentconfig == "string") {
                    component.componentconfig = JSON.parse(component.componentconfig);
                }
                // Check if role name is available
                let role_name = this.checkRoleName(component.role_id);

                this.selectedComponent = component;

                this.component = component.component;
                this.configValues = component.componentconfig;
            }
        }
    }


    saveChanges() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            if (this.selectedComponent.componentconfig) {
                this.selectedComponent.componentconfig = JSON.stringify(this.selectedComponent.componentconfig);
                delete this.selectedComponent.role_name;

                switch (this.currentTableActive) {
                    case "default":
                        this.backend.postRequest('configuration/configurator/sysuicomponentdefaultconf/' + this.selectedComponent.id, {}, { config: this.selectedComponent }).subscribe(status => {
                            if (status.status == "success") {
                                loadingModalRef.instance.self.destroy();
                                this.toast.sendToast('changes saved');
                            }
                        });
                        break;
                    case "default_custom":
                        this.backend.postRequest('configuration/configurator/sysuicustomcomponentdefaultconf/' + this.selectedComponent.id, {}, { config: this.selectedComponent }).subscribe(status => {
                            if (status.status == "success") {
                                loadingModalRef.instance.self.destroy();
                                this.toast.sendToast('changes saved');
                            }
                        });
                        break;
                    case "global":
                        this.backend.postRequest('configuration/configurator/sysuicomponentmoduleconf/' + this.selectedComponent.id, {}, { config: this.selectedComponent }).subscribe(status => {
                            if (status.status == "success") {
                                loadingModalRef.instance.self.destroy();
                                this.toast.sendToast('changes saved');
                            }
                        });
                        break;
                    case "custom":
                        this.backend.postRequest('configuration/configurator/sysuicustomcomponentmoduleconf/' + this.selectedComponent.id, {}, { config: this.selectedComponent }).subscribe(status => {
                            if (status.status == "success") {
                                loadingModalRef.instance.self.destroy();
                                this.toast.sendToast('changes saved');
                            }
                        });
                        break;
                    default:
                        loadingModalRef.instance.self.destroy();
                        break;
                }
                this.selectedComponent.componentconfig = JSON.parse(this.selectedComponent.componentconfig);
            }
        });
    }

    addConf() {

        this.modalservice.openModal('ModuleConfigAddDialog').subscribe(modal => {

            modal.instance.mode = "add";
            if (this.currentTableActive == "default_custom" || this.currentTableActive == "custom") {
                modal.instance.currentType = "custom";
            } else {
                if (this.edit_mode == 'all') {
                    modal.instance.currentType = "global";
                } else {
                    modal.instance.currentType = "custom";
                }
            }
            modal.instance.currentModule = this.currentModule;
            modal.instance.allowGlobal = this.allowGlobalModal;

            modal.instance.response$.subscribe(comp => {
                this.response(comp);

            })
        });
    }

    copyConf() {

        this.modalservice.openModal('ModuleConfigAddDialog').subscribe(modal => {

            modal.instance.mode = "copy";
            modal.instance.currentComponent = this.selectedComponent;
            modal.instance.currentRole = this.selectedComponent.role_id;
            modal.instance.currentModule = this.currentModule;
            modal.instance.allowGlobal = this.allowGlobalModal;


            modal.instance.response$.subscribe(comp => {
                this.response(comp);
            })
        });
    }

    response(comp) {

        if (comp.module) {
            this.currentModule = comp.module;
        } else {
            this.currentModule = "*";
        }

        if (comp.table == "sysuicomponentdefaultconf" || comp.table == "sysuicomponentmoduleconf") {
            this.currentTableActive = "global";
        } else {
            this.currentTableActive = "custom";
        }

        if (comp.table == "sysuicustomcomponentdefaultconf") {
            this.currentTableActive = "default_custom"
        }
        if (comp.table == "sysuicustomcomponentmoduleconf") {
            this.currentTableActive = "custom"
        }
        if (comp.table == "sysuicomponentdefaultconf") {
            this.currentTableActive = "default"
        }
        if (comp.table == "sysuicomponentmoduleconf") {
            this.currentTableActive = "global"
        }

        this.newComponent = comp;
        this.selectedModule();
    }


}

