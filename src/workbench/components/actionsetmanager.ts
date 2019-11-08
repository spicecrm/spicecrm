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

    private sysModules: Array<any> = [];
    private currentModule: string = '*';
    private currentActionSet: string = '';
    private currentActionSetItems: Array<any> = [];
    private selectedItem: any = {
        type: '',
        actionset: '',
        id: '',
        isViewMode: false
    };
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

            // iniutialize the metadata service
            // this.metadata.loadActionSets(new Subject<any>(), true);
            // this.metadata.loadActionDefs(new Subject<any>(), true);
            // this.metadata.loadComponents(new Subject<any>(), true);
        });
        this.checkMode();
    }


    get currentActionSetName() {
        return this.metadata.getActionSet(this.currentActionSet).name;
    }

    set currentActionSetName(newName) {
        this.metadata.setActionset(this.currentActionSet, {name: newName, package: this.currentActionSetPackage});
    }

    get currentActionSetPackage() {
        return this.metadata.getActionSet(this.currentActionSet).package;
    }

    set currentActionSetPackage(newPackage) {
        this.metadata.setActionset(this.currentActionSet, {name: this.currentActionSetName, package: newPackage});
    }

    get showDetailIcon() {
        return this.showActionSetDetails ? 'chevronup' : 'chevrondown';
    }

    private toggleDetail() {
        this.showActionSetDetails = !this.showActionSetDetails;
    }

    get actionSetType() {
        if (this.currentActionSet) {
            return this.metadata.getActionSet(this.currentActionSet).type;
        } else {
            return '';
        }
    }

    private getActionSets(type = undefined) {
        if (!type) {
            return this.metadata.getActionSets(this.currentModule);
        } else {
            let retArray = [];
            let actionsets = this.metadata.getActionSets(this.currentModule);

            for (let actionset of actionsets) {
                if (actionset.type == type) {
                    retArray.push(actionset);
                }
            }

            return retArray;
        }
    }

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
        if (this.actionSetType == "custom") {
            this.view.setEditMode();
        } else {
            this.view.setViewMode();
        }
    }

    private setAllMode() {
        this.view.setEditMode();
    }


    private loadCurrentActionset() {
        this.selectedItem = {
            type: '',
            actionset: '',
            id: ''
        };
        this.checkMode();
        this.currentActionSetItems = [];
        this.addActionSetItems(this.currentActionSet, 0, this.actionSetType);
    }

    private addItem(parent = '') {
        this.modalservice.openModal('ActionsetManagerAddDialog').subscribe(modal => {
            modal.instance.metadata = this.metadata;
            modal.instance.module = this.currentModule;
            modal.instance.actionsettype = this.actionSetType;
            modal.instance.edit_mode = this.edit_mode;
            modal.instance.parent = parent ? parent : this.currentActionSet;
            modal.instance.closedialog.subscribe(added => {
                if (added) {
                    this.loadCurrentActionset();
                }
            });
        });
    }

    private unlinkItem(item) {
        if (this.metadata.removeActionsetItem(item.actionset, item.item)) {
            this.selectedItem = {
                type: '',
                actionset: '',
                id: ''
            };
            this.loadCurrentActionset();
        }
    }

    private editActionset() {
        this.modalservice.openModal('ActionsetManagerEditDialog').subscribe(modal => {
            modal.instance.actionset = this.currentActionSet;
            modal.instance.edit_mode = this.edit_mode;
            modal.instance.closedialog.subscribe(update => {
                if (update !== false) {
                    if (this.currentActionSet != '') {
                        this.metadata.setActionset(this.currentActionSet, {name: update.name, type: update.type});
                    } else {
                        let actionsetid = this.modelutilities.generateGuid();
                        this.metadata.addActionset(actionsetid, this.currentModule, update.name, update.type);
                        this.currentActionSet = actionsetid;
                    }
                    this.checkMode();
                }
            });
        });
    }


    private addActionset() {
        this.currentActionSet = '';
        this.currentActionSetItems = [];
        this.editActionset();
    }

    private reset() {
        this.currentActionSet = '';
        this.currentActionSetItems = [];
        this.selectedItem = {
            type: '',
            actionset: '',
            id: ''
        };
    }

    private addActionSetItems(actionSet, level = 0, parentScope = "global") {
        let actionsetItems = this.metadata.getActionSetItems(actionSet);

        // for(let [index, actionsetItem] of actionsetItems){
        actionsetItems.forEach((actionsetItem, index) => {

            let customModeGlobalField = false;
            if (this.edit_mode == "custom" && !this.crNoneActive) {
                if (parentScope == "global") {
                    customModeGlobalField = true;
                }
            } else if (this.edit_mode == "none" || this.crNoneActive) {
                customModeGlobalField = true;
            }

            if (actionsetItem.field) {
                let currentActionSetItem = {
                    level: level + 1,
                    type: 'field',
                    actionset: actionSet,
                    id: actionsetItem.id,
                    name: actionsetItem.field,
                    index: index,
                    count: actionsetItems.length,
                    item: actionsetItem,
                    parentScope: parentScope,
                    customModeGlobalField: customModeGlobalField
                };
                this.currentActionSetItems.push(currentActionSetItem);

            } else if (actionsetItem.actionset) {

                let customModeGlobalField = false;
                if (this.edit_mode == "custom" && !this.crNoneActive) {
                    let item = this.metadata.getActionSet(actionsetItem.actionset);
                    if (item) {
                        if (item.type == "global") {
                            customModeGlobalField = true;
                        }
                    }
                } else if (this.edit_mode == "none" || this.crNoneActive) {
                    customModeGlobalField = true;
                }
                // getDisplayType(currentActionSetItem) == 'global'
                // this.metadata.getActionset(actionsetItem.actionset).type

                let currentActionSetItem = {
                    level: level + 1,
                    type: 'actionset',
                    actionset: actionSet,
                    id: actionsetItem.id,
                    name: this.metadata.getActionsetName(actionsetItem.actionset),
                    index: index,
                    count: actionsetItems.length,
                    item: actionsetItem,
                    parentScope: parentScope,
                    customModeGlobalField: customModeGlobalField
                };
                this.currentActionSetItems.push(currentActionSetItem);

                this.addActionSetItems(actionsetItem.actionset, level + 1, this.getDisplayType(currentActionSetItem));
            }
        });
    }

    private getDisplayName(item) {
        if (item.type == 'field') {
            return item.item.field;
        }

        if (item.type == 'actionset') {
            return this.metadata.getActionsetName(item.item.actionset);
        }
    }

    private getDisplayType(item) {
        if (item.type == 'actionset') {
            let ditem = this.metadata.getActionSet(item.item.actionset);
            if (ditem) {
                return ditem.type;
            }
        }
        return;
    }

    private isSelected(id) {
        return id == this.selectedItem.id;
    }

    private selectItem(currentActionSetItem, scope) {
        this.selectedItem = {
            type: currentActionSetItem.type,
            actionset: currentActionSetItem.actionset,
            id: currentActionSetItem.id,
            isViewMode: currentActionSetItem.customModeGlobalField
        };
    }

    private moveDown(item) {
        let actionsetItems = this.metadata.getActionSetItems(item.actionset);

        // get the current ind ex in the array
        let currentIndex = 0;
        actionsetItems.some((someitem, someindex) => {
            if (someitem.id == item.id) {
                currentIndex = someindex;
                return true;
            }
        });
        if (currentIndex < actionsetItems.length - 1) {
            // shuffle
            let currentItem = actionsetItems.splice(currentIndex, 1);
            actionsetItems.splice(currentIndex + 1, 0, currentItem[0]);

            // renumber
            let i = 0;
            for (let item of actionsetItems) {
                item.sequence = i;
                i++;
            }

            // reload
            this.loadCurrentActionset();
        }
    }

    private moveUp(item) {
        let actionsetItems = this.metadata.getActionSetItems(item.actionset);

        // get the current ind ex in the array
        let currentIndex = 0;
        actionsetItems.some((someitem, someindex) => {
            if (someitem.id == item.id) {
                currentIndex = someindex;
                return true;
            }
        });

        if (currentIndex > 0) {
            // shuffle
            let currentItem = actionsetItems.splice(currentIndex, 1);
            actionsetItems.splice(currentIndex - 1, 0, currentItem[0]);

            // renumber
            let i = 0;
            for (let item of actionsetItems) {
                item.sequence = i;
                i++;
            }

            // reload
            this.loadCurrentActionset();
        }
    }

    private allowEdit() {
        return this.currentActionSet != '';
    }

    // Find table
    private findTable(type) {

        let tablescope;

        if (type == "global") {
            tablescope = {
                actionsetTable: "sysuiactionsets",
                itemsTable: "sysuiactionsetsitems"
            };
        } else {
            tablescope = {
                actionsetTable: "sysuicustomactionsets",
                itemsTable: "sysuicustomactionsetsitems"
            };
        }
        return tablescope;
    }

    //
    // private copy(currentActionset = this.currentActionSet, customizeItem = null) {
    //     this.modalservice.openModal('FieldsetManagerCopyDialog').subscribe(modal => {
    //
    //         modal.instance.fieldset = currentActionset;
    //         modal.instance.sysModules = this.sysModules;
    //         modal.instance.metaFieldSets = this.metadata.getAllFieldsets();
    //
    //         modal.instance.edit_mode = this.edit_mode;
    //
    //         modal.instance.closedialog.subscribe(update => {
    //
    //             this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
    //
    //                 let fieldset = {...update.fieldset};
    //
    //                 let module = update.module;
    //                 let type = update.type;
    //                 let name = update.name;
    //
    //                 if (module == "*") {
    //                     module = 'global';
    //                 }
    //
    //
    //                 let checkParams = {
    //                     'module': module,
    //                     'type': type,
    //                     'name': name
    //                 };
    //
    //                 // check if component exists
    //                 this.backend.getRequest('spiceui/core/fieldsetalreadyexists', checkParams).subscribe(
    //                     data => {
    //                         if (data == false) {
    //
    //                             let tablescope = this.findTable(type);
    //
    //                             fieldset.module = module;
    //                             if (module == "global") {
    //                                 fieldset.module = '*';
    //                             }
    //                             fieldset.name = name;
    //
    //                             let newid = this.modelutilities.generateGuid(); // generate id
    //                             fieldset.id = newid;
    //
    //                             let save_items: any = [];
    //
    //                             for (let item of fieldset.items) {
    //                                 let copied_item = {...item};
    //                                 copied_item.fieldconfig = {...item.fieldconfig};
    //
    //                                 copied_item.id = this.modelutilities.generateGuid(); // item generate id
    //                                 copied_item.fieldset_id = newid;
    //                                 save_items.push(copied_item);
    //                             }
    //
    //
    //                             delete fieldset.items;
    //                             delete fieldset.type;
    //
    //
    //                             this.backend.postRequest('configurator/' + tablescope.fieldsetTable + '/' + fieldset.id, null, fieldset).subscribe(
    //                                 (success) => {
    //                                     let savecounter = 0;
    //
    //                                     fieldset.items = save_items;
    //                                     fieldset.type = type;
    //
    //                                     for (let save_item of save_items) {
    //                                         this.backend.postRequest('configurator/' + tablescope.itemsTable + '/' + save_item.id, null, save_item).subscribe(
    //                                             (success) => {
    //                                                 savecounter++;
    //                                                 if (savecounter == save_items.length) {
    //                                                     if (customizeItem) {
    //                                                         customizeItem.item.fieldset = fieldset.id;
    //                                                         let parenttablescope = this.findTable(customizeItem.parentScope);
    //
    //                                                         this.backend.postRequest('configurator/' + parenttablescope.itemsTable + '/' + customizeItem.id, null, customizeItem.item).subscribe(
    //                                                             (success) => {
    //                                                                 loadingModalRef.instance.self.destroy();
    //                                                                 this.toast.sendToast('saved!');
    //                                                                 this.metadata.addFieldset(fieldset.id, fieldset.module, fieldset.name, type, save_items);
    //                                                             },
    //                                                             (error) => {
    //                                                                 loadingModalRef.instance.self.destroy();
    //                                                                 this.toast.sendAlert('saving link failed!, ' + save_item.id);
    //                                                                 console.error(error);
    //                                                             }
    //                                                         );
    //
    //                                                     } else {
    //                                                         loadingModalRef.instance.self.destroy();
    //                                                         this.toast.sendToast('saved!');
    //                                                         this.currentModule = fieldset.module;
    //                                                         this.metadata.addFieldset(fieldset.id, fieldset.module, fieldset.name, type, save_items);
    //                                                         this.currentFieldSet = fieldset.id;
    //
    //                                                         this.currentFieldSetItems = save_items;
    //                                                         this.selectedItem = {};
    //                                                         this.currentFieldSetName = fieldset.name;
    //                                                         this.loadCurrentFieldset();
    //                                                     }
    //                                                 }
    //                                             },
    //                                             (error) => {
    //                                                 loadingModalRef.instance.self.destroy();
    //                                                 this.toast.sendAlert('saving failed!, ' + save_item.id);
    //                                                 console.error(error);
    //                                             }
    //                                         );
    //                                     }
    //                                 },
    //                                 (error) => {
    //                                     loadingModalRef.instance.self.destroy();
    //                                     this.toast.sendAlert('saving failed!');
    //                                     console.error(error);
    //                                 }
    //                             );
    //                         } else {
    //                             loadingModalRef.instance.self.destroy();
    //                             this.toast.sendAlert('Fieldset already exists!');
    //                         }
    //                     });
    //             });
    //         });
    //     });
    // }


    private saveChanges() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            this.backend.getRequest('spiceui/core/actionsets').subscribe((res: any) => {


                let rawActionsets = this.metadata.getRawActionSets();
                let addedActionsets: any = {};
                let changedActionsets: any = {};
                let deletedActionsets: any = {};

                for (let actionset in rawActionsets) {
                    if (!res.actionsets[actionset]) {
                        addedActionsets[actionset] = rawActionsets[actionset];
                        continue;
                    }

                    if (JSON.stringify(rawActionsets[actionset]) !== JSON.stringify(res.actionsets[actionset])) {
                        changedActionsets[actionset] = rawActionsets[actionset];
                    }

                    delete (res.actionsets[actionset]);
                }

                deletedActionsets = res.actionsets;


                let postData = {
                    add: addedActionsets,
                    update: changedActionsets,
                    delete: deletedActionsets
                };

                this.backend.postRequest('spiceui/core/actionsets', {}, postData).subscribe((res: any) => {
                    this.broadcast.broadcastMessage('metadata.updateactionsets', postData);
                    loadingModalRef.instance.self.destroy();
                    this.toast.sendToast('changes saved');
                });
            });
        });
    }

    get getAllowCopyButton() {
        if (!this.currentActionSet) {
            return false;
        } else {
            return this.allowBarButtons;
        }
    }
}
