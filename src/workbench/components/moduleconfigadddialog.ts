/**
 * @module WorkbenchModule
 */
import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';


import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';
import {configurationService} from '../../services/configuration.service';

import {toast} from "../../services/toast.service";


@Component({
    selector: 'moduleconfig-add-dialog',
    templateUrl: '../templates/moduleconfigadddialog.html'
})
export class ModuleConfigAddDialog implements OnInit {

    @Input() public mode: string = "";
    @Input() public currentComponent: any;
    @Input() public currentRole: string = "";
    @Input() public currentType: string = "custom";
    @Input() public currentModule: string = "";
    @Input() public allowGlobal: boolean = false;

    @Output('response') public response$: EventEmitter<any> = new EventEmitter<any>();

    public showDeprecatedWarning: boolean = false;
    public self;

    public types = [
        {value: "custom", text: 'LBL_CUSTOM'},
        {value: "global", text: 'LBL_GLOBAL'},
    ];


    public compSelectList: any[] = [];
    public compselecteditem: any;
    public compDisabled = false;

    public moduleSelectList: any[] = [];
    public moduleselecteditem: any;

    public roleSelectList: any[] = [];
    public roleselecteditem: any;


    constructor(
        public backend: backend,
        public metadata: metadata,
        public language: language,
        public modelutilities: modelutilities,
        public utils: modelutilities,
        public toast: toast,
        public configuration: configurationService
        ) {
    }

    get roleSelectedItem() {
        return this.roleselecteditem;
    }

    set roleSelectedItem(role) {
        this.roleselecteditem = role;
    }

    get moduleSelectedItem() {
        return this.moduleselecteditem;
    }

    set moduleSelectedItem(module) {
        this.moduleselecteditem = module;
    }

    get compSelectedItem() {
        return this.compselecteditem;
    }

    set compSelectedItem(component) {
        this.compselecteditem = component;

        // Show warning if the component is deprecated
        this.showDeprecatedWarning = true;
        this.showDeprecatedWarning = component.deprecated == '1';
    }

    public ngOnInit() {
        if (!this.allowGlobal) {
            this.types.pop();
        }

        this.moduleSelectList= [{id: "*", name: "*"}];
        if (this.mode in {add:true, copy: true} && "*" == this.currentModule) {
            this.moduleSelectedItem = {id: "*", name: "*"};
        }
        let modules = this.metadata.getModules();
        modules.sort();
        for(let module of modules){
            this.moduleSelectList.push({id: module, name: module});

            if (this.mode in {add:true, copy: true} && module == this.currentModule) {
                this.moduleSelectedItem = {id: module, name: module};
            }
        }

        this.roleSelectList = [{id: "*", name: "*", group: "global"}];
        this.roleSelectedItem = {id: "*", name: "*", group: "global"};
        let roles = this.metadata.getSysRoles();
        for(let role of roles){
            this.roleSelectList.push({id: role.id, name: role.name, group: role.scope});

            if (this.mode == "copy" && role.id == this.currentRole) {
                this.roleSelectedItem = {id: role.id, name: role.name, group: "global"};
            }
        }

        let components = this.configuration.getData('components');
        for(let component in components){
            this.compSelectList.push({
                id: component,
                name: component,
                deprecated: components[component].deprecated == '1'
            });
        }
        this.compSelectList.sort((a, b) => a.name.localeCompare(b.name));

        if (this.mode == "copy") {
            this.compDisabled = true;
            this.compSelectedItem = {id: this.currentComponent.id, name: this.currentComponent.component, version: this.currentComponent.version, package: this.currentComponent.package};
        }
    }


    public validate() {
        // validation show button
        if (this.currentModule == "*") {
            if (this.compSelectedItem && this.roleSelectedItem && this.currentType) {
                return false;
            }
        } else {
            if (this.compSelectedItem && this.moduleSelectedItem && this.roleSelectedItem && this.currentType) {
                return false;
            }
        }
        return true;
    }

    // sort the list
    public sortArray(list) {
        list.sort((a, b) => {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        return list;
    }


    public closeDialog() {
        this.self.destroy();
    }


    public save() {

        let type = this.currentType;
        let table = "";
        let saveComp: any = {};

        let newid = this.modelutilities.generateGuid(); // generate id

        if (this.currentComponent) {
            // copy
            let configString = JSON.stringify(this.currentComponent.componentconfig);
            saveComp = {
                component: this.currentComponent.component,
                componentconfig: configString,
                package: this.currentComponent.package,
                version: this.currentComponent.version
            };

        } else {
            // add
            saveComp = {
                component: this.compSelectedItem.name,
                componentconfig: "{}"
            };
        }

        saveComp.id = newid;
        saveComp.role_id = this.roleSelectedItem.id;

        // set module if != default table
        if (saveComp.module != "*") {
            saveComp.module = this.moduleSelectedItem.name;
        }

        // find table
        if (type == "custom" && saveComp.module == "*") {
            table = "sysuicustomcomponentdefaultconf";
        }
        if (type == "custom" && saveComp.module != "*") {
            table = "sysuicustomcomponentmoduleconf";
        }
        if (type == "global" && saveComp.module == "*") {
            table = "sysuicomponentdefaultconf";
        }
        if (type == "global" && saveComp.module != "*") {
            table = "sysuicomponentmoduleconf";
        }


        this.saveComponent(saveComp, table);
    }


    public saveComponent(saveComp, table) {

        saveComp.type = this.currentType;

        let path = "";
        let loadTaskKey: string;
        if (saveComp.module == "*") {
            path = "componentdefaultalreadyexists";
            loadTaskKey = 'componentdefaultconfigs';
            delete saveComp.module;
        } else {
            path = "componentmodulealreadyexists";
            loadTaskKey = 'componentmoduleconfigs';
        }

        // check if component exists
        this.backend.getRequest('configuration/spiceui/core/' + path, saveComp).subscribe(
            data => {
                delete saveComp.type;

                if (data == false) {
                    this.backend.postRequest('configuration/configurator/' + table + '/' + saveComp.id, null, { config: saveComp }).subscribe(
                        (success) => {
                            this.configuration.reloadTaskData(loadTaskKey);
                            this.toast.sendToast('saved');
                            saveComp.table = table;
                            this.response$.emit(saveComp);
                            this.self.destroy();
                        },
                        (error) => {
                            this.toast.sendAlert('saving failed!');
                            console.error(error);
                        }
                    );
                } else {
                    this.toast.sendAlert('Configuration already exists!');
                }
            },
            (error) => {
                this.toast.sendAlert('Saving configuration failed!');
                console.error(error);
            }
        );
    }
}
