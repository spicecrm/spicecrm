
    import {
    Component, EventEmitter, Input, Output,
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

        crActive: boolean = false;
        change_request_required: boolean = false;
        globalEdit: boolean = true;

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


        constructor(
            private backend: backend,
            private metadata: metadata,
            private language: language,
            private toast: toast,
            private modalservice: modal,
            private configurationService: configurationService,
            private view: view
        ) {
            // get roles
            this.backend.getRequest('configurator/entries/sysuiroles').subscribe(roles => {
                this.sysRoles['*'] = '*';
                for (let role of roles)
                    this.sysRoles[role.id] = role.name;
            });

            this.backend.getRequest('spiceui/admin/modules').subscribe(modules => {
                this.sysModules = modules;

                // iniutialize the metadata service
                this.metadata.loadFieldSets(new Subject<any>());
                this.metadata.loadComponents(new Subject<any>());
            });

            // this.globalEdit = this.configurationService.getCapabilityConfig('core').allow_global_edit ? true : false;
            // this.change_request_required = this.configurationService.getCapabilityConfig('systemdeployment').change_request_required ? true : false;
            // if (this.change_request_required == true) {
            //     //check if changeRequest is active
            //     this.backend.getRequest('systemdeploymentcrs/active').subscribe(crresponse => {
            //         if (crresponse.id != "") {
            //             this.crActive = true;
            //         } else {
            //             this.toast.sendToast(this.language.getLabel('LBL_ACTIVATE_CR_WARNING'), 'warning', null, 3);
            //         }
            //     })
            // } else {
            //     this.crActive = true;
            // }
            view.setEditMode(); //quickfix

        }

        selectedModule() {
            this.currentComponent = '';
            this.componentTree = [];
            this.selectedComponent = {};


            if(this.currentModule == "*"){
                if(this.currentTableActive == "default_custom") {
                    this.loadDefaultCustom();
                }else{
                    this.loadDefault();
                }
            }else{
                if(this.currentTableActive == "custom"){
                    this.loadCustom();
                }else{
                    this.loadGlobal();
                }
            }
        }

        loadGlobal() {
            this.selectedComponent = {};
            if(this.currentModule != "*") {

                this.currentTableActive = "global";
                    this.backend.getRequest('configurator/entries/sysuicomponentmoduleconf').subscribe(data => {
                        this.buildTreeList(data);
                    });
            }else{
                this.loadDefault();
            }
        }

        loadCustom() {
            this.selectedComponent = {};
            if(this.currentModule != "*") {

                this.currentTableActive = "custom";
                    this.backend.getRequest('configurator/entries/sysuicustomcomponentmoduleconf').subscribe(data => {
                        this.buildTreeList(data);
                    });
            }else{
                this.loadDefaultCustom()
            }
        }

        loadDefault() {

            this.currentTableActive = "default";
                this.backend.getRequest('configurator/entries/sysuicomponentdefaultconf').subscribe(data => {
                    this.buildTreeList(data);
                });
        }

        loadDefaultCustom() {

            this.currentTableActive = "default_custom";
                this.backend.getRequest('configurator/entries/sysuicustomcomponentdefaultconf').subscribe(data => {
                    this.buildTreeList(data);
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


        buildTreeList(data) {

            let components = [];

            for (let entry of data) {
                if (entry.module == this.currentModule || this.currentModule == "*") {
                    this.componentModuleList.push(entry);

                    //Check if role name is available
                    var role_name = this.checkRoleName(entry.role_id);


                    let comp: any = {};

                    comp = {
                        id: entry.id,
                        parent_id: entry.component,
                        clickable: true,
                        name: role_name
                    }

                    //new component is added
                    if(this.newComponent){
                        if(this.newComponent.id == entry.id){
                            comp.selected = true;
                            this.selectedOutputItem(comp); //open new component
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
                        components.push({
                            id: entry.component,
                            parent_id: null,
                            clickable: false,
                            name: entry.component
                        })
                    }
                }
            }
            this.newComponent = {};
            this.treelist = components;
            return components;
        }


        checkRoleName(role_id){
            var role_name = "";
            if(this.sysRoles[role_id]){
                role_name = this.sysRoles[role_id];
            }else{
                role_name = role_id;
            }
            return role_name; //return name if available ... otherwise role id
        }

        selectedOutputItem(item){
            for(let component of this.componentModuleList){
                if(component.id == item.id){
                    if(typeof component.componentconfig == "string"){
                        component.componentconfig = JSON.parse(component.componentconfig);
                    }
                    //Check if role name is available
                    var role_name = this.checkRoleName(component.role_id);

                    component.role_name = role_name;
                    this.selectedComponent = component;
                }
            }
        }


        saveChanges(){

            if (this.selectedComponent.componentconfig) {
                this.selectedComponent.componentconfig = JSON.stringify(this.selectedComponent.componentconfig);
                delete this.selectedComponent.role_name;

                switch (this.currentTableActive) {
                    case "default":
                        this.backend.postRequest('configurator/sysuicomponentdefaultconf/' + this.selectedComponent.id, {}, this.selectedComponent).subscribe(status => {
                            if(status.status == "success"){
                                this.toast.sendToast('changes saved');
                            }
                        });
                        break;
                    case "default_custom":
                        this.backend.postRequest('configurator/sysuicustomcomponentdefaultconf/' + this.selectedComponent.id, {}, this.selectedComponent).subscribe(status => {
                            if(status.status == "success"){
                                this.toast.sendToast('changes saved');
                            }
                        });
                        break;
                    case "global":
                        this.backend.postRequest('configurator/sysuicomponentmoduleconf/' + this.selectedComponent.id, {}, this.selectedComponent).subscribe(status => {
                            if(status.status == "success"){
                                this.toast.sendToast('changes saved');
                            }
                        });
                        break;
                    case "custom":
                        this.backend.postRequest('configurator/sysuicustomcomponentmoduleconf/' + this.selectedComponent.id, {}, this.selectedComponent).subscribe(status => {
                            if(status.status == "success"){
                                this.toast.sendToast('changes saved');
                            }
                        });
                        break;
                    default:
                        break;
                }
                this.selectedComponent.componentconfig = JSON.parse(this.selectedComponent.componentconfig);

            }
        }

        addConf(){

            this.modalservice.openModal('ModuleConfigAddDialog').subscribe( modal => {

                modal.instance.mode = "add";

                if(this.currentTableActive == "default_custom" || this.currentTableActive == "custom"){
                    modal.instance.currentType = "custom";
                }else{
                    modal.instance.currentType =  "global";
                }
                modal.instance.currentModule = this.currentModule;

                modal.instance.response$.subscribe(comp => {
                    this.response(comp);

                })
            });
        }

        copyConf(){

            this.modalservice.openModal('ModuleConfigAddDialog').subscribe( modal => {

                modal.instance.mode = "copy";


                modal.instance.currentComponent = this.selectedComponent;
                modal.instance.currentRole = this.selectedComponent.role_id;

                modal.instance.currentModule = this.currentModule;

                modal.instance.response$.subscribe(comp => {
                    this.response(comp);
                })
            });
        }

        response(comp){

            if(comp.module){
                this.currentModule = comp.module;
            }else{
                this.currentModule = "*";
            }

            if(comp.table == "sysuicomponentdefaultconf" || comp.table == "sysuicomponentmoduleconf"){
                this.currentTableActive = "global";
            }else{
                this.currentTableActive = "custom";
            }

            if(comp.table == "sysuicustomcomponentdefaultconf"){this.currentTableActive = "default_custom"}
            if(comp.table == "sysuicustomcomponentmoduleconf"){this.currentTableActive = "custom"}
            if(comp.table == "sysuicomponentdefaultconf"){this.currentTableActive = "default"}
            if(comp.table == "sysuicomponentmoduleconf"){this.currentTableActive = "global"}

            this.newComponent = comp;
            this.selectedModule();
        }


    }

