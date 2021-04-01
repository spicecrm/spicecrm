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
 * @module WorkbenchModule
 */
import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';


import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';

import {toast} from "../../services/toast.service";


@Component({
    selector: 'moduleconfig-add-dialog',
    templateUrl: './src/workbench/templates/moduleconfigadddialog.html'
})
export class ModuleConfigAddDialog implements OnInit {

    @Input() public mode: string = "";
    @Input() public currentComponent: any;
    @Input() public currentRole: string = "";
    @Input() public currentType: string = "";
    @Input() public currentModule: string = "";
    @Input() public allowGlobal: boolean = false;

    @Output('response') public response$: EventEmitter<any> = new EventEmitter<any>();

    private showDeprecatedWarning: boolean = false;
    private self;

    private types = [
        {value: "custom", text: 'LBL_CUSTOM'},
        {value: "global", text: 'LBL_GLOBAL'},
    ];


    private compSelectList: any[] = [];
    private compselecteditem: any;
    private compDisabled = false;

    private moduleSelectList: any[] = [];
    private moduleselecteditem: any;

    private roleSelectList: any[] = [];
    private roleselecteditem: any;


    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private utils: modelutilities, private toast: toast,) {
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
            this.currentType = 'custom';
        }

        // get all modules
        this.backend.getRequest('configurator/entries/sysmodules').subscribe(data => {
            this.moduleSelectList.push({id: "*", name: "*"});
            if (this.mode == "add" && "*" == this.currentModule) {
                this.moduleSelectedItem = {id: "*", name: "*"};
            }
            for (let module of data) {
                this.moduleSelectList.push({id: module.id, name: module.module, group: "global"});

                if (this.mode == "add" && module.module == this.currentModule) {
                    this.moduleSelectedItem = {id: module.id, name: module.module, group: "global"};
                }
            }
            this.sortArray(this.moduleSelectList);
            this.moduleSelectList = Object.assign([], this.moduleSelectList);
        });
        this.backend.getRequest('configurator/entries/syscustommodules').subscribe(data => {

            for (let module of data) {
                this.moduleSelectList.push({id: module.id, name: module.module, group: "custom"});

                if (this.mode == "add" && module.module == this.currentModule) {
                    this.moduleSelectedItem = {id: module.id, name: module.module, group: "custom"};
                }
            }
            this.sortArray(this.moduleSelectList);
            this.moduleSelectList = Object.assign([], this.moduleSelectList);
        });


        // get all roles
        this.backend.getRequest('configurator/entries/sysuiroles').subscribe(data => {

            this.roleSelectList.push({id: "*", name: "*"});
            for (let role of data) {
                this.roleSelectList.push({id: role.id, name: role.name, group: "global"});

                if (this.mode == "copy" && role.id == this.currentRole) {
                    this.roleSelectedItem = {id: role.id, name: role.name, group: "global"};
                }
                if (this.currentRole == "*") {
                    this.roleSelectedItem = {id: "*", name: "*"};
                }
            }
            this.sortArray(this.roleSelectList);
            this.roleSelectList = Object.assign([], this.roleSelectList);
        });
        this.backend.getRequest('configurator/entries/sysuicustomroles').subscribe(data => {
            for (let role of data) {
                this.roleSelectList.push({id: role.id, name: role.name, group: "custom"});

                if (this.mode == "copy" && role.id == this.currentRole) {
                    this.roleSelectedItem = {id: role.id, name: role.name, group: "custom"};
                }
                if (this.currentRole == "*") {
                    this.roleSelectedItem = {id: "*", name: "*"};
                }
            }
            this.sortArray(this.roleSelectList);
            this.roleSelectList = Object.assign([], this.roleSelectList);
        });


        // get all objectrepositories
        this.backend.getRequest('configurator/entries/sysuiobjectrepository').subscribe(data => {

            for (let comp of data) {
                this.compSelectList.push({
                    id: comp.id,
                    name: comp.object,
                    deprecated: comp.deprecated,
                    group: "global"
                });

                if (this.mode == "copy") {
                    this.compDisabled = true;
                    this.compSelectedItem = {id: this.currentComponent.id, name: this.currentComponent.component};
                }
            }
            this.sortArray(this.compSelectList);
            this.compSelectList = Object.assign([], this.compSelectList);
        });
        this.backend.getRequest('configurator/entries/sysuicustomobjectrepository').subscribe(data => {
            for (let comp of data) {
                this.compSelectList.push({
                    id: comp.id,
                    name: comp.object,
                    deprecated: comp.deprecated,
                    group: "custom"
                });

                if (this.mode == "copy") {
                    this.compDisabled = true;
                    this.compSelectedItem = {id: this.currentComponent.id, name: this.currentComponent.component};
                }
            }
            this.sortArray(this.compSelectList);
            this.compSelectList = Object.assign([], this.compSelectList);
        });


    }


    private validate() {
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
    private sortArray(list) {
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


    private closeDialog() {
        this.self.destroy();
    }


    private save() {

        let type = this.currentType;
        let table = "";
        let saveComp: any = {};

        let newid = this.modelutilities.generateGuid(); // generate id

        if (this.currentComponent) {
            // copy
            let configString = JSON.stringify(this.currentComponent.componentconfig);
            saveComp = {
                component: this.currentComponent.component,
                componentconfig: configString
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


    private saveComponent(saveComp, table) {

        saveComp.type = this.currentType;

        let path = "";
        if (saveComp.module == "*") {
            path = "componentdefaultalreadyexists";
            delete saveComp.module;
        } else {
            path = "componentmodulealreadyexists";
        }

        // check if component exists
        this.backend.getRequest('spiceui/core/' + path, saveComp).subscribe(
            data => {
                delete saveComp.type;

                if (data == false) {
                    this.backend.postRequest('configurator/' + table + '/' + saveComp.id, null, saveComp).subscribe(
                        (success) => {

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
