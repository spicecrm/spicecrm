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
import {
    Component
} from '@angular/core';
import {Subject} from 'rxjs';

import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {configurationService} from '../../services/configuration.service';
import {modal} from '../../services/modal.service';
import {view} from "../../services/view.service";

@Component({
    templateUrl: './src/workbench/templates/actionsetmanager.html',
    providers: [view]
})
export class ActionsetManager {

    private edit_mode: string = "custom";
    private allowBarButtons: boolean = true;
    private crNoneActive: boolean = false;

    private change_request_required: boolean = false;

    private sysModules: any = [];
    private currentModule: string = '*';
    private currentActionSet: any = {
        id: '',
        module: '',
        name: '',
        package: '',
        type: '',
        actions: [],
        isnew: false
    };

    private actionSetBackup = "";

    // private currentActionSetItems: Array<any> = [];
    private selectedItem: any = null;

    private selectedItemID = "";

    private showActionSetDetails: boolean = false;

    constructor(private backend: backend,
                private metadata: metadata,
                private language: language,
                private modelutilities: modelutilities,
                private broadcast: broadcast,
                private toast: toast,
                private modalservice: modal,
                private configurationService: configurationService,
                private view: view,
                private modal: modal) {

        this.backend.getRequest('spiceui/admin/modules').subscribe(modules => {
            this.sysModules = modules;
        });
        this.checkMode();
    }

    /**
     *
     * @param type (global, custom) string
     *
     * get all actionsets for the current module and type(global, custom)
     */
    private getActionSets(type = null) {
        let retArray = [];
        if (!type) {
            retArray = this.metadata.getActionSets(this.currentModule);
        } else {
            let actionsets = this.metadata.getActionSets(this.currentModule);
            for (let actionset of actionsets) {
                if (actionset.type == type) {
                    retArray.push(actionset);
                }
            }
        }
        return retArray;
    }

    // check edit mode
    private checkMode() {
        this.edit_mode = this.configurationService.getCapabilityConfig('core').edit_mode;
        this.change_request_required = this.configurationService.getCapabilityConfig('systemdeployment').change_request_required ? true : false;

        if (!(this.edit_mode == 'none' || this.edit_mode == 'custom' || this.edit_mode == 'all')) {
            this.edit_mode = 'custom';
        }

        if (this.change_request_required) {
            this.backend.getRequest('systemdeploymentcrs/active').subscribe(crresponse => {
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
        this.allowBarButtons = false;
    }

    private setCustomMode() {
        if (this.currentActionSet.type == "custom") {
            this.view.setEditMode();
        } else {
            this.view.setViewMode();
        }
    }

    private setAllMode() {
        this.view.setEditMode();
    }

    get checkForChanges() {
        return this.checkForChangesFunction();
    }

    private checkForChangesFunction() {
        if(this.currentActionSet.id != "") {
            return JSON.stringify(this.currentActionSet) == this.actionSetBackup ? false: true;
        } else {
            return false;
        }
    }

    private selectCurrentActionset() {
        if(this.currentActionSet.id) {
            let newID = this.currentActionSet.id;
            if(this.actionSetBackup != "") {
                // set it back to the old id .. for the dirty-field check
                this.currentActionSet.id = JSON.parse(this.actionSetBackup).id;
                JSON.stringify(this.actionSetBackup);
                if(this.checkForChangesFunction()) {
                    this.modal.confirm(  'LBL_ALL_CHANGES_WOULD_BE_DELETED.', 'LBL_ARE_YOU_SURE' ).subscribe( ( answer ) => {
                        if(answer) {
                            this.deleteChanges();
                            this.loadCurrentActionset(newID);
                        }
                    });
                } else {
                    this.loadCurrentActionset(newID);
                }
            } else {
                this.loadCurrentActionset(newID);
            }
        }
    }

    /**
     * @param newID string
     *
     * selected an actionset
     */
    private loadCurrentActionset(newID) {
        this.selectedItem = null;
        this.checkMode();
        this.currentActionSet = this.metadata.getActionSet(newID);
        this.actionSetBackup = JSON.stringify({...this.currentActionSet});
        // this.addActionSetItems(this.currentActionSet.id, this.currentActionSet.type);
        if(this.currentActionSet) {
            if (this.currentActionSet.actions) {
                if (this.currentActionSet.actions.length > 0) {
                    this.selectItem(this.currentActionSet.actions[0]);
                }
            }
        }
    }


    /**
     *
     * Add a new actionsetitem
     */
    private addActionsetItem() {
        let currentActionSetItem = {
            // actionset: this.currentActionSet,
            action: "NEW",
            component: null,
            id: this.modelutilities.generateGuid(),
            sequence: this.currentActionSet.actions.length,
            singlebutton: false,
            package: this.currentActionSet.package,
            version: this.currentActionSet.version,
            actionconfig: {},
            parentScope: this.currentActionSet.type
        };
        this.currentActionSet.actions.push(currentActionSetItem);

        this.metadata.setActionSetItems(this.currentActionSet.id, this.currentActionSet.actions);
        this.selectItem(currentActionSetItem);
    }
    private deleteItem(item) {
        this.modal.confirm( 'LBL_ARE_YOU_SURE', 'LBL_REMOVE_ITEM' ).subscribe( ( answer ) => {
            if(answer) {
                this.currentActionSet.actions.splice(
                    this.currentActionSet.actions.map(e => {
                        return e.id;
                    }).indexOf(item.id), 1);
            }
        });
    }

    /**
     *
     * Add a new actionset
     */
    private addActionset() {
        this.modalservice.openModal('ActionsetManagerAddDialog').subscribe(modal => {

            modal.instance.sysModules = this.sysModules;
            modal.instance.actionsetModule = this.currentModule;
            modal.instance.mode = 'add';
            modal.instance.edit_mode = this.edit_mode;
            modal.instance.actionsetName="";

            modal.instance.closedialog.subscribe(added => {
                if (added) {
                    let newId =  this.modelutilities.generateGuid();
                    this.currentActionSet.actions = [];
                    this.metadata.setActionSet(newId, {
                        module: added.module,
                        name: added.name,
                        type: added.type,
                        actions: this.currentActionSet.actions
                    });

                    this.reset();
                    this.currentModule = added.module;

                    this.currentActionSet.id = newId;
                    this.currentActionSet.module = added.module;
                    this.currentActionSet.name = added.name;
                    this.currentActionSet.type = added.type;
                    this.currentActionSet.actions = [];
                    this.currentActionSet.package = '';
                    this.currentActionSet.isnew = true;
                }
            });
        });
    }

    /**
     *
     * Selected a module
     * Check if any changes are active
     */
    private selectModule() {
        let newModule = this.currentActionSet.module;
        if(this.actionSetBackup != "") {
            // set it back to the old id .. for the dirty-field check
            this.currentActionSet.module = JSON.parse(this.actionSetBackup).module;
            JSON.stringify(this.actionSetBackup);
            if(this.checkForChangesFunction()) {
                this.modal.confirm(  'LBL_ALL_CHANGES_WOULD_BE_DELETED.', 'LBL_ARE_YOU_SURE' ).subscribe( ( answer ) => {
                    if(answer) {
                        this.deleteChanges();
                        this.currentActionSet.module = newModule;
                    }
                });
            } else {
                this.currentActionSet.module = newModule;
            }
        } else {
            this.currentActionSet.module = newModule;
        }
    }

    /**
     * reset the current data
     */
    private reset() {
        this.currentActionSet = {
            id: '',
            module: '',
            name: '',
            package: '',
            type: '',
            actions: []
        };
        this.selectedItem = null;
        this.selectedItemID = "";
    }

    /**#
     * @param item object
     *
     * get the label of the item
     */
    private getDisplayName(item) {
        let name = item.action ? item.action: item.component;
        return item.actionconfig.label ? name + " (" + this.language.getLabel(item.actionconfig.label) + ")":  name;
    }

    /**#
     * check if id is selected
     * return bool
     */
    private isSelected(id) {
        return id == this.selectedItem.id;
    }

    private selectItem(currentActionSetItem) {
        this.selectedItemID = currentActionSetItem.id;
        for (let item of this.currentActionSet.actions) {
            if(item.id == currentActionSetItem.id) {
                this.selectedItem = item;
            }
        }
    }

    /**
     * handles the drop event and rearranges the array
     * @param event
     */
    private drop(event) {
        this.currentActionSet.actions.splice(event.currentIndex, 0, this.currentActionSet.actions.splice(event.previousIndex, 1)[0]);

        // rebuild the sequence
        let i = 0;
        for(let actionitem of this.currentActionSet.actions){
            actionitem.sequence = i;
            i++;
        }
    }

    private deleteChanges() {
        if(this.currentActionSet.isnew) {
            this.metadata.removeActionset(this.currentActionSet.id);
            this.reset();
            this.actionSetBackup = "";
        } else {
            this.currentActionSet = {...JSON.parse(this.actionSetBackup)};
            this.metadata.setActionSet(this.currentActionSet.id, this.currentActionSet);
            // this.currentActionSet = this.metadata.getActionSet(this.currentActionSet.id);
            if(this.currentActionSet.actions.length > 0) {
                this.selectItem(this.currentActionSet.actions[0]);
            }
        }
    }

    private saveChanges() {

        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {

            let addedActionsets: any = {};
            let changedActionsets: any = {};
            let deletedActionsets: any = {};

            if(this.currentActionSet.isnew) {
                addedActionsets[this.currentActionSet.id] = this.currentActionSet;
            }
            if(!this.currentActionSet.isnew) {
                changedActionsets[this.currentActionSet.id] = this.currentActionSet;
            }

            let postData = {
                add: addedActionsets,
                update: changedActionsets,
                delete: deletedActionsets
            };

            this.backend.postRequest('spiceui/core/actionsets', {}, postData).subscribe((res: any) => {
                if(res) {
                    this.broadcast.broadcastMessage('metadata.updateactionsets', postData);
                    loadingModalRef.instance.self.destroy();
                    this.toast.sendToast('changes saved');
                    this.loadCurrentActionset(this.currentActionSet.id);
                } else {
                    loadingModalRef.instance.self.destroy();
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                }
            });

        });
    }

    private copy() {
        this.modalservice.openModal('ActionsetManagerAddDialog').subscribe(modal => {

            modal.instance.sysModules = this.sysModules;
            modal.instance.actionsetModule = this.currentModule;
            modal.instance.mode = "copy";
            modal.instance.edit_mode = this.edit_mode;
            modal.instance.actionsetName = (' ' + this.currentActionSet.name).slice(1);

            modal.instance.closedialog.subscribe(added => {
                if (added) {
                    let newId =  this.modelutilities.generateGuid();
                    // this.metadata.addActionset(newId, added.module, added.name, added.type, []);

                    let actions = JSON.parse(JSON.stringify(this.currentActionSet.actions));
                    this.metadata.setActionSet(newId, {
                        module: added.module,
                        name: added.name,
                        type: added.type,
                        actions: actions
                    });

                    // generate new ids for every action
                    for (let action of actions) {
                        action.id = this.modelutilities.generateGuid();
                    }

                    this.reset();
                    this.currentModule = added.module;

                    this.currentActionSet.id = newId;
                    this.currentActionSet.module = added.module;
                    this.currentActionSet.name = added.name;
                    this.currentActionSet.type = added.type;
                    this.currentActionSet.actions = actions;
                    // this.currentActionSet.package = this.currentActionSet.package;
                    this.currentActionSet.isnew = true;
                }
            });
        });
    }
}
