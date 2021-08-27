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
    templateUrl: './src/workbench/templates/fieldsetmanager.html',
    providers: [view]
})
export class FieldsetManager {

    private edit_mode: string = "custom";
    private allowBarButtons: boolean = true;
    private crNoneActive: boolean = false;

    private change_request_required: boolean = false;

    private sysModules: Array<any> = [];
    private currentModule: string = '*';
    private currentFieldSet: string = '';
    private currentFieldSetItems: Array<any> = [];
    private selectedItem: any = {
        type: '',
        fieldset: '',
        id: '',
        isViewMode: false
    };
    private showFieldSetDetails: boolean = false;

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

        this.backend.getRequest('system/spiceui/admin/modules').subscribe(modules => {
            this.sysModules = modules;

            // iniutialize the metadata service
            // this.metadata.loadFieldSets(new Subject<any>(), true);
            // this.metadata.loadFieldDefs(new Subject<any>(), true);
            // this.metadata.loadComponents(new Subject<any>(), true);
        });
        this.checkMode();
    }


    get currentFieldSetName() {
        return this.metadata.getFieldset(this.currentFieldSet).name;
    }

    set currentFieldSetName(newName) {
        this.metadata.setFieldset(this.currentFieldSet, {name: newName, package: this.currentFieldSetPackage});
    }

    get currentFieldSetPackage() {
        return this.metadata.getFieldset(this.currentFieldSet).package;
    }

    set currentFieldSetPackage(newPackage) {
        this.metadata.setFieldset(this.currentFieldSet, {name: this.currentFieldSetName, package: newPackage});
    }

    get showDetailIcon() {
        return this.showFieldSetDetails ? 'chevronup' : 'chevrondown';
    }

    private toggleDetail() {
        this.showFieldSetDetails = !this.showFieldSetDetails;
    }

    get fieldSetType() {
        if (this.currentFieldSet) {
            return this.metadata.getFieldset(this.currentFieldSet).type;
        } else {
            return '';
        }
    }

    private getFieldSets(type = undefined) {
        if (!type) {
            return this.metadata.getFieldSets(this.currentModule);
        } else {
            let retArray = [];
            let fieldsets = this.metadata.getFieldSets(this.currentModule);

            for (let fieldset of fieldsets) {
                if (fieldset.type == type) {
                    retArray.push(fieldset);
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
        this.allowBarButtons = false;
    }

    private setCustomMode() {
        if (this.fieldSetType == "custom") {
            this.view.setEditMode();
        } else {
            this.view.setViewMode();
        }
    }

    private setAllMode() {
        this.view.setEditMode();
    }


    private loadCurrentFieldset() {
        this.selectedItem = {
            type: '',
            fieldset: '',
            id: ''
        };
        this.checkMode();
        this.currentFieldSetItems = [];
        this.addFieldSetItems(this.currentFieldSet, 0, this.fieldSetType);
    }

    private addItem(parent = '') {
        this.modalservice.openModal('FieldsetManagerAddDialog').subscribe(modal => {
            modal.instance.metadata = this.metadata;
            modal.instance.module = this.currentModule;
            modal.instance.fieldsettype = this.fieldSetType;
            modal.instance.edit_mode = this.edit_mode;
            modal.instance.parent = parent ? parent : this.currentFieldSet;
            modal.instance.closedialog.subscribe(added => {
                if (added) {
                    this.loadCurrentFieldset();
                }
            });
        });
    }

    private unlinkItem(item) {
        if (this.metadata.removeFieldsetItem(item.fieldset, item.item)) {
            this.selectedItem = {
                type: '',
                fieldset: '',
                id: ''
            };
            this.loadCurrentFieldset();
        }
    }

    private editFieldset() {
        this.modalservice.openModal('FieldsetManagerEditDialog').subscribe(modal => {
            modal.instance.fieldset = this.currentFieldSet;
            modal.instance.edit_mode = this.edit_mode;
            modal.instance.closedialog.subscribe(update => {
                if (update !== false) {
                    if (this.currentFieldSet != '') {
                        this.metadata.setFieldset(this.currentFieldSet, {name: update.name, type: update.type});
                    } else {
                        let fieldsetid = this.modelutilities.generateGuid();
                        this.metadata.addFieldset(fieldsetid, this.currentModule, update.name, update.type);
                        this.currentFieldSet = fieldsetid;
                    }
                    this.checkMode();
                }
            });
        });
    }


    private addFieldset() {
        this.currentFieldSet = '';
        this.currentFieldSetItems = [];
        this.editFieldset();
    }

    private reset() {
        this.currentFieldSet = '';
        this.currentFieldSetItems = [];
        this.selectedItem = {
            type: '',
            fieldset: '',
            id: ''
        };
    }

    private addFieldSetItems(fieldSet, level = 0, parentScope = "global") {
        let fieldsetItems = this.metadata.getFieldSetItems(fieldSet);

        // for(let [index, fieldsetItem] of fieldsetItems){
        fieldsetItems.forEach((fieldsetItem, index) => {

            let customModeGlobalField = false;
            if (this.edit_mode == "custom" && !this.crNoneActive) {
                if (parentScope == "global") {
                    customModeGlobalField = true;
                }
            } else if (this.edit_mode == "none" || this.crNoneActive) {
                customModeGlobalField = true;
            }

            if (fieldsetItem.field) {
                let currentFieldSetItem = {
                    level: level + 1,
                    type: 'field',
                    fieldset: fieldSet,
                    id: fieldsetItem.id,
                    name: fieldsetItem.field,
                    index: index,
                    count: fieldsetItems.length,
                    item: fieldsetItem,
                    parentScope: parentScope,
                    customModeGlobalField: customModeGlobalField
                };
                this.currentFieldSetItems.push(currentFieldSetItem);

            } else if (fieldsetItem.fieldset) {

                let customModeGlobalField = false;
                if (this.edit_mode == "custom" && !this.crNoneActive) {
                    let item = this.metadata.getFieldset(fieldsetItem.fieldset);
                    if (item) {
                        if (item.type == "global") {
                            customModeGlobalField = true;
                        }
                    }
                } else if (this.edit_mode == "none" || this.crNoneActive) {
                    customModeGlobalField = true;
                }
                // getDisplayType(currentFieldSetItem) == 'global'
                // this.metadata.getFieldset(fieldsetItem.fieldset).type

                let currentFieldSetItem = {
                    level: level + 1,
                    type: 'fieldset',
                    fieldset: fieldSet,
                    id: fieldsetItem.id,
                    name: this.metadata.getFieldsetName(fieldsetItem.fieldset),
                    index: index,
                    count: fieldsetItems.length,
                    item: fieldsetItem,
                    parentScope: parentScope,
                    customModeGlobalField: customModeGlobalField
                };
                this.currentFieldSetItems.push(currentFieldSetItem);

                this.addFieldSetItems(fieldsetItem.fieldset, level + 1, this.getDisplayType(currentFieldSetItem));
            }
        });
    }

    private getDisplayName(item) {
        if (item.type == 'field') {
            return item.item.field;
        }

        if (item.type == 'fieldset') {
            return this.metadata.getFieldsetName(item.item.fieldset);
        }
    }

    private getDisplayType(item) {
        if (item.type == 'fieldset') {
            let ditem = this.metadata.getFieldset(item.item.fieldset);
            if (ditem) {
                return ditem.type;
            }
        }
        return;
    }

    private isSelected(id) {
        return id == this.selectedItem.id;
    }

    private selectItem(currentFieldSetItem, scope) {
        this.selectedItem = {
            type: currentFieldSetItem.type,
            fieldset: currentFieldSetItem.fieldset,
            id: currentFieldSetItem.id,
            isViewMode: currentFieldSetItem.customModeGlobalField
        };
    }

    private moveDown(item) {
        let fieldsetItems = this.metadata.getFieldSetItems(item.fieldset);

        // get the current ind ex in the array
        let currentIndex = 0;
        fieldsetItems.some((someitem, someindex) => {
            if (someitem.id == item.id) {
                currentIndex = someindex;
                return true;
            }
        });
        if (currentIndex < fieldsetItems.length - 1) {
            // shuffle
            let currentItem = fieldsetItems.splice(currentIndex, 1);
            fieldsetItems.splice(currentIndex + 1, 0, currentItem[0]);

            // renumber
            let i = 0;
            for (let item of fieldsetItems) {
                item.sequence = i;
                i++;
            }

            // reload
            this.loadCurrentFieldset();
        }
    }

    private moveUp(item) {
        let fieldsetItems = this.metadata.getFieldSetItems(item.fieldset);

        // get the current ind ex in the array
        let currentIndex = 0;
        fieldsetItems.some((someitem, someindex) => {
            if (someitem.id == item.id) {
                currentIndex = someindex;
                return true;
            }
        });

        if (currentIndex > 0) {
            // shuffle
            let currentItem = fieldsetItems.splice(currentIndex, 1);
            fieldsetItems.splice(currentIndex - 1, 0, currentItem[0]);

            // renumber
            let i = 0;
            for (let item of fieldsetItems) {
                item.sequence = i;
                i++;
            }

            // reload
            this.loadCurrentFieldset();
        }
    }

    private allowEdit() {
        return this.currentFieldSet != '';
    }

    // Find table
    private findTable(type) {

        let tablescope;

        if (type == "global") {
            tablescope = {
                fieldsetTable: "sysuifieldsets",
                itemsTable: "sysuifieldsetsitems"
            };
        } else {
            tablescope = {
                fieldsetTable: "sysuicustomfieldsets",
                itemsTable: "sysuicustomfieldsetsitems"
            };
        }
        return tablescope;
    }


    private copy(currentFieldset = this.currentFieldSet, customizeItem = null) {
        this.modalservice.openModal('FieldsetManagerCopyDialog').subscribe(modal => {

            modal.instance.fieldset = currentFieldset;
            modal.instance.sysModules = this.sysModules;
            modal.instance.metaFieldSets = this.metadata.getAllFieldsets();

            modal.instance.edit_mode = this.edit_mode;

            modal.instance.closedialog.subscribe(update => {

                this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {

                    let fieldset = {...update.fieldset};

                    let module = update.module;
                    let type = update.type;
                    let name = update.name;

                    if (module == "*") {
                        module = 'global';
                    }


                    let checkParams = {
                        'module': module,
                        'type': type,
                        'name': name
                    };

                    // check if component exists
                    this.backend.getRequest('configuration/spiceui/core/fieldsetalreadyexists', checkParams).subscribe(
                        data => {
                            if (data == false) {

                                let tablescope = this.findTable(type);

                                fieldset.module = module;
                                if (module == "global") {
                                    fieldset.module = '*';
                                }
                                fieldset.name = name;

                                let newid = this.modelutilities.generateGuid(); // generate id
                                fieldset.id = newid;

                                let save_items: any = [];

                                for (let item of fieldset.items) {
                                    let copied_item = {...item};
                                    copied_item.fieldconfig = {...item.fieldconfig};

                                    copied_item.id = this.modelutilities.generateGuid(); // item generate id
                                    copied_item.fieldset_id = newid;
                                    save_items.push(copied_item);
                                }


                                delete fieldset.items;
                                delete fieldset.type;
                                delete fieldset.fid;


                                this.backend.postRequest('configuration/configurator/' + tablescope.fieldsetTable + '/' + fieldset.id, null, { config: fieldset }).subscribe(
                                    (success) => {
                                        let savecounter = 0;

                                        fieldset.items = save_items;
                                        fieldset.type = type;

                                        for (let save_item of save_items) {
                                            this.backend.postRequest('configuration/configurator/' + tablescope.itemsTable + '/' + save_item.id, null, { config: save_item }).subscribe(
                                                (success) => {
                                                    savecounter++;
                                                    if (savecounter == save_items.length) {
                                                        if (customizeItem) {
                                                            customizeItem.item.fieldset = fieldset.id;
                                                            let parenttablescope = this.findTable(customizeItem.parentScope);

                                                            this.backend.postRequest('configuration/configurator/' + parenttablescope.itemsTable + '/' + customizeItem.id, null, { config: customizeItem.item }).subscribe(
                                                                (success) => {
                                                                    loadingModalRef.instance.self.destroy();
                                                                    this.toast.sendToast('saved!');
                                                                    this.metadata.addFieldset(fieldset.id, fieldset.module, fieldset.name, type, save_items);
                                                                },
                                                                (error) => {
                                                                    loadingModalRef.instance.self.destroy();
                                                                    this.toast.sendAlert('saving link failed!, ' + save_item.id);
                                                                    console.error(error);
                                                                }
                                                            );

                                                        } else {
                                                            loadingModalRef.instance.self.destroy();
                                                            this.toast.sendToast('saved!');
                                                            this.currentModule = fieldset.module;
                                                            this.metadata.addFieldset(fieldset.id, fieldset.module, fieldset.name, type, save_items);
                                                            this.currentFieldSet = fieldset.id;

                                                            this.currentFieldSetItems = save_items;
                                                            this.selectedItem = {};
                                                            this.currentFieldSetName = fieldset.name;
                                                            this.loadCurrentFieldset();
                                                        }
                                                    }
                                                },
                                                (error) => {
                                                    loadingModalRef.instance.self.destroy();
                                                    this.toast.sendAlert('saving failed!, ' + save_item.id);
                                                    console.error(error);
                                                }
                                            );
                                        }
                                    },
                                    (error) => {
                                        loadingModalRef.instance.self.destroy();
                                        this.toast.sendAlert('saving failed!');
                                        console.error(error);
                                    }
                                );
                            } else {
                                loadingModalRef.instance.self.destroy();
                                this.toast.sendAlert('Fieldset already exists!');
                            }
                        });
                });
            });
        });
    }


    private saveChanges() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            this.backend.getRequest('configuration/spiceui/core/fieldsets').subscribe((res: any) => {


                let rawFieldsets = this.metadata.getRawFieldSets();
                let addedFieldsets: any = {};
                let changedFieldsets: any = {};
                let deletedFieldsets: any = {};

                for (let fieldset in rawFieldsets) {
                    if (!res.fieldsets[fieldset]) {
                        addedFieldsets[fieldset] = rawFieldsets[fieldset];
                        continue;
                    }

                    if (JSON.stringify(rawFieldsets[fieldset]) !== JSON.stringify(res.fieldsets[fieldset])) {
                        changedFieldsets[fieldset] = rawFieldsets[fieldset];
                    }

                    delete (res.fieldsets[fieldset]);
                }

                deletedFieldsets = res.fieldsets;


                let postData = {
                    add: addedFieldsets,
                    update: changedFieldsets,
                    delete: deletedFieldsets
                };

                this.backend.postRequest('configuration/spiceui/core/fieldsets', {}, postData).subscribe((res: any) => {
                    this.broadcast.broadcastMessage('metadata.updatefieldsets', postData);
                    loadingModalRef.instance.self.destroy();
                    this.toast.sendToast('changes saved');
                });
            });
        });
    }

    get getAllowCopyButton() {
        if (!this.currentFieldSet) {
            return false;
        } else {
            return this.allowBarButtons;
        }
    }
}
