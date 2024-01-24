/**
 * @module WorkbenchModule
 */
import {
    Component, ComponentRef
} from '@angular/core';
import {firstValueFrom, Subject} from 'rxjs';

import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {configurationService} from '../../services/configuration.service';
import {modal} from '../../services/modal.service';
import {view} from "../../services/view.service";
import {FieldsetManagerCopyDialog} from "./fieldsetmanagercopydialog";
import {subscription} from "../../services/subscription.service";

@Component({
    selector: 'fieldset-manager',
    templateUrl: '../templates/fieldsetmanager.html',
    providers: [view]
})
export class FieldsetManager {

    public edit_mode: string = "custom";
    public allowBarButtons: boolean = true;
    public crNoneActive: boolean = false;
    public change_request_required: boolean = false;

    /**
     * the list of modules
     */
    public modules: string[] = [];

    public currentModule: string = '*';
    public currentFieldSet: string = '';
    public currentFieldSetItems: any[] = [];
    public selectedItem: any = {
        type: '',
        fieldset: '',
        id: '',
        isViewMode: false
    };
    public showFieldSetDetails: boolean = false;

    constructor(public backend: backend,
                public metadata: metadata,
                public language: language,
                public modelutilities: modelutilities,
                public broadcast: broadcast,
                public toast: toast,
                public modalservice: modal,
                public configurationService: configurationService,
                public view: view,
                public modal: modal
    ) {

        // get the modules fromt eh metadata service
        this.modules = this.metadata.getModules().sort();

        this.checkMode();
    }


    get currentFieldSetName() {
        return this.metadata.getFieldset(this.currentFieldSet).name;
    }

    set currentFieldSetName(newName) {
        this.metadata.setFieldset(this.currentFieldSet, {name: newName, package: this.currentFieldSetPackage, version: this.currentFieldSetVersion});
    }

    get currentFieldSetPackage() {
        return this.metadata.getFieldset(this.currentFieldSet).package;
    }

    set currentFieldSetPackage(newPackage) {
        this.metadata.setFieldset(this.currentFieldSet, {name: this.currentFieldSetName, package: newPackage, version: this.currentFieldSetVersion});
    }

    get currentFieldSetVersion() {
        return this.metadata.getFieldset(this.currentFieldSet).version;
    }

    set currentFieldSetVersion(newVersion) {
        this.metadata.setFieldset(this.currentFieldSet, {name: this.currentFieldSetName, package: this.currentFieldSetPackage, version: newVersion});
    }

    get showDetailIcon() {
        return this.showFieldSetDetails ? 'chevronup' : 'chevrondown';
    }

    public toggleDetail() {
        this.showFieldSetDetails = !this.showFieldSetDetails;
    }

    get fieldSetType() {
        if (this.currentFieldSet) {
            return this.metadata.getFieldset(this.currentFieldSet).type;
        } else {
            return '';
        }
    }

    public getFieldSets(type?) {
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

    public checkMode() {
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

    public setNoneMode() {
        this.view.setViewMode();
        this.allowBarButtons = false;
    }

    public setCustomMode() {
        if (this.fieldSetType == "custom") {
            this.view.setEditMode();
        } else {
            this.view.setViewMode();
        }
    }

    public setAllMode() {
        this.view.setEditMode();
    }


    public loadCurrentFieldset() {
        this.selectedItem = {
            type: '',
            fieldset: '',
            id: ''
        };
        this.checkMode();
        this.currentFieldSetItems = [];
        this.addFieldSetItems(this.currentFieldSet, 0, this.fieldSetType);
    }

    public addItem(parent = '') {
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

    public unlinkItem(item) {
        if (this.metadata.removeFieldsetItem(item.fieldset, item.item)) {
            this.selectedItem = {
                type: '',
                fieldset: '',
                id: ''
            };
            this.loadCurrentFieldset();
        }
    }

    public editFieldset() {
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


    public addFieldset() {
        this.currentFieldSet = '';
        this.currentFieldSetItems = [];
        this.editFieldset();
    }

    public reset() {
        this.currentFieldSet = '';
        this.currentFieldSetItems = [];
        this.selectedItem = {
            type: '',
            fieldset: '',
            id: ''
        };
    }

    public addFieldSetItems(fieldSet, level = 0, parentScope = "global") {
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

    public getDisplayName(item) {
        if (item.type == 'field') {
            return item.item.field;
        }

        if (item.type == 'fieldset') {
            return this.metadata.getFieldsetName(item.item.fieldset);
        }
    }

    public getDisplayType(item) {
        if (item.type == 'fieldset') {
            let ditem = this.metadata.getFieldset(item.item.fieldset);
            if (ditem) {
                return ditem.type;
            }
        }
        return;
    }

    public isSelected(id) {
        return id == this.selectedItem.id;
    }

    public selectItem(currentFieldSetItem, scope) {
        this.selectedItem = {
            type: currentFieldSetItem.type,
            fieldset: currentFieldSetItem.fieldset,
            id: currentFieldSetItem.id,
            isViewMode: currentFieldSetItem.customModeGlobalField
        };
    }

    public moveDown(item) {
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

    public moveUp(item) {
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

    public allowEdit() {
        return this.currentFieldSet != '';
    }

    // Find table
    public findTable(type) {

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

    /**
     * open copy modal
     */
    public async openCopyModal(subFieldset?) {

        const fieldset = subFieldset ? subFieldset.item.fieldset : this.currentFieldSet;
        const copyModal: ComponentRef<FieldsetManagerCopyDialog> = await firstValueFrom(this.modalservice.openModal('FieldsetManagerCopyDialog'));

        copyModal.instance.fieldset = this.metadata.getFieldset(fieldset);
        copyModal.instance.edit_mode = this.edit_mode;

        copyModal.instance.response.subscribe({
            next: async copyDialogRes => {

                if (!copyDialogRes) return;

                const isLoading = this.modal.await('LBL_PROCESSING');

                const existing = await this.checkExisting(copyDialogRes.module, copyDialogRes.type, copyDialogRes.name);

                if (!existing) {
                    copyModal.instance.close();
                   this.copyFieldset(copyDialogRes, isLoading, subFieldset);

                } else {
                    isLoading.next(true);
                    isLoading.complete();
                    this.toast.sendAlert('Fieldset already exists!');
                }

            }
        });
    }

    /**
     * check fieldset by name and module and type
     * @param module
     * @param type
     * @param name
     * @private
     */
    private checkExisting(module: string, type: 'custom' | 'global', name: string) {
        const checkParams = {module, type, name};
        return firstValueFrom(this.backend.getRequest('configuration/spiceui/core/fieldsetalreadyexists', checkParams));
    }

    /**
     * copy fieldset
     * @param copyDialogRes
     * @param isLoading
     * @param subFieldset
     * @private
     */
    private copyFieldset(copyDialogRes, isLoading, subFieldset?) {

        const newFieldsetId = this.modelutilities.generateGuid();

        // set the new parent fieldset for the sub fieldset
        if (subFieldset) {
            subFieldset.item.fieldset = newFieldsetId;
        }

        const fieldsetData = {[newFieldsetId]: this.copyFieldsetToMetadata(newFieldsetId, copyDialogRes)};
        const postData = { add: fieldsetData};

        this.backend.postRequest('configuration/spiceui/core/fieldsets', {}, { add: fieldsetData}).subscribe({
            next: () => {
                isLoading.next(true);
                isLoading.complete();
                this.broadcast.broadcastMessage('metadata.updatefieldsets', postData);
                this.toast.sendToast('LBL_DATA_SAVED', 'success');

                // reset the view data
                if (!subFieldset) {
                    this.currentModule = copyDialogRes.module;
                    this.currentFieldSet = newFieldsetId;
                    this.currentFieldSetName = copyDialogRes.name;
                }

                this.loadCurrentFieldset();
            },
            error: () => {
                isLoading.next(false);
                isLoading.complete();
                this.broadcast.broadcastMessage('metadata.updatefieldsets', {delete: fieldsetData});
                this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        });
    }

    /**
     * copy fieldset data to metadata service
     * @param newFieldsetId
     * @param copyDialogRes
     * @private
     */
    private copyFieldsetToMetadata(newFieldsetId, copyDialogRes): any {

        this.metadata.addFieldset(newFieldsetId, copyDialogRes.module, copyDialogRes.name, copyDialogRes.type);

        copyDialogRes.fieldset.items.forEach(item => {
            if (!item.fieldset) {
                this.metadata.addFieldToFieldset(this.modelutilities.generateGuid(), newFieldsetId, item.field, item.fieldconfig);
            } else {
                this.metadata.addFieldsetToFieldset(this.modelutilities.generateGuid(), newFieldsetId, item.fieldset, item.fieldconfig);
            }
        });

        return this.metadata.getFieldset(newFieldsetId);
    }

    public saveChanges() {
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
