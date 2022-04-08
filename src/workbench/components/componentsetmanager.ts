/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {Subject} from 'rxjs';
import {ComponentsetManagerEditDialog} from './componentsetmanagereditdialog';
import {modal} from '../../services/modal.service';
import {ComponentsetManagerAddDialog} from './componentsetmanageradddialog';
import {view} from '../../services/view.service';
import {configurationService} from '../../services/configuration.service';

@Component({
    templateUrl: '../templates/componentsetmanager.html',
    providers: [view]
})
export class ComponentsetManager {

    /**
     * the edit mode
     */
    public edit_mode: 'none'|'custom'|'all' = "custom";

    public allowBarButtons: boolean = true;
    // crNoneActive: boolean = false;

    public change_request_required: boolean = false;

    public modules: any[] = [];
    public currentModule: string = '*';
    public currentComponentSet: string = '';
    public currentComponentSetItems: any[] = [];
    public selectedId: string = '';
    public selectedComponent: any = {};

    public showAddDialog: boolean = false;
    public showComponentsetDetails: boolean = false;

    constructor(public backend: backend,
                public metadata: metadata,
                public language: language,
                public modelutilities: modelutilities,
                public broadcast: broadcast,
                public toast: toast,
                public modalservice: modal,
                public view: view,
                public configurationService: configurationService
    ) {

        // get teh modules from teh metadata service
        this.modules = this.metadata.getModules();
        this.modules.sort();

        this.checkMode();
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

    public setNoneMode() {
        this.view.setViewMode();
        this.allowBarButtons = false;
    }

    public setCustomMode() {
        if (this.componentSetType == "custom") {
            this.view.setEditMode();
        } else {
            this.view.setViewMode();
        }
    }

    public setAllMode() {
        this.view.setEditMode();
    }


    get showDetailIcon() {
        return this.showComponentsetDetails ? 'chevronup' : 'chevrondown';
    }

    public toggleDetail() {
        this.showComponentsetDetails = !this.showComponentsetDetails;
    }

    get componentSetType() {
        if (this.currentComponentSet) {
            return this.metadata.getComponentSet(this.currentComponentSet).type;
        } else {
            return '';
        }
    }

    get currentComponentSetPackage() {
        return this.metadata.getComponentSet(this.currentComponentSet).package;
    }

    set currentComponentSetPackage(newPackage) {
        let componentset = this.metadata.getComponentSet(this.currentComponentSet);
        componentset.package = newPackage;
    }

    get currentComponentSetName() {
        return this.metadata.getComponentSet(this.currentComponentSet).name;
    }

    set currentComponentSetName(newName) {
        let componentset = this.metadata.getComponentSet(this.currentComponentSet);
        componentset.name = newName;
    }

    public componentDeprecated(component) {
        let object = this.metadata.getSystemComponents(component.module).find(x => x.component === component.component);
        if (object.deprecated == '1') {
            return true;
        } else {
            return false;
        }
    }

    public getComponentSetItemName(componentsetItem) {
        if (componentsetItem.componentconfig.name) {
            return `(${this.language.getLabel(componentsetItem.componentconfig.name)})`;
        }

        if (componentsetItem.componentconfig.object) {
            return `(${this.language.getModuleName(componentsetItem.componentconfig.object)})`;
        }
    }

    public getComponentSets(type?) {
        if (!type) {
            return this.metadata.getComponentSets(this.currentModule);
        } else {
            let retArray = [];
            let componentsets = this.metadata.getComponentSets(this.currentModule);

            for (let componentset of componentsets) {
                if (componentset.type == type) {
                    retArray.push(componentset);
                }
            }

            return retArray;
        }
    }

    public getComponentSetItems() {
        return this.currentComponentSet ? this.metadata.getComponentSetObjects(this.currentComponentSet) : [];
    }

    public selectItem(item) {
        this.selectedId = item.id;
        this.selectedComponent = item;
    }

    public isSelected(id) {
        return id == this.selectedId;
    }

    public getComponentsetConfig() {
        if (this.selectedComponent.componentconfig) {
            return JSON.stringify(this.selectedComponent.componentconfig);
        }
    }

    public reset() {
        this.selectedId = '';
        this.selectedComponent = {};
        this.currentComponentSet = '';
    }

    public selectComponentSet() {
        this.checkMode();
        this.selectedId = '';
        this.selectedComponent = {};
    }

    public addComponent() {
        this.showAddDialog = true;
        this.modalservice.openModal('ComponentsetManagerAddDialog').subscribe(modal => {
            modal.instance.module = this.currentModule;
            modal.instance.parent = this.currentComponentSet;
        });
    }

    public addComponentset() {
        this.reset();
        this.editComponentset();
    }

    public editComponentset() {
        this.modalservice.openModal('ComponentsetManagerEditDialog').subscribe(modal => {
            modal.instance.componentset = this.currentComponentSet;
            modal.instance.edit_mode = this.edit_mode;
            modal.instance.closedialog.subscribe(componentset => {
                if (componentset !== false) {
                    if (this.currentComponentSet === '') {
                        let id = this.modelutilities.generateGuid();
                        this.metadata.addComponentSet(id, this.currentModule, componentset.name, componentset.type);
                        this.currentComponentSet = id;
                        this.checkMode();
                    } else {
                        let componentset = this.metadata.getComponentSet(this.currentComponentSet);
                        componentset.name = componentset.name;
                    }
                }
            });
        });
    }

    /**
     * deletes a componentset item by the id
     * @param item
     */
    public deleteComponent(item) {
        let componentsetItems = this.metadata.getComponentSetObjects(this.currentComponentSet);
        componentsetItems.splice(componentsetItems.findIndex(c => c.id == item.id), 1);
    }

    /**
     * handles the drop event and rearranges the array
     * @param event
     */
    public drop(event) {
        let componentsetItems = this.metadata.getComponentSetObjects(this.currentComponentSet);
        componentsetItems.splice(event.currentIndex, 0, componentsetItems.splice(event.previousIndex, 1)[0]);

        // recalculate the sequence
        let sequence = 0;
        for(let componentsetItem of componentsetItems){
            componentsetItem.sequence = sequence;
            sequence++;
        }

    }


    public saveChanges() {

        this.backend.getRequest('configuration/spiceui/core/components').subscribe((res: any) => {

            let rawComponetsets = this.metadata.getRawComponentSets();
            let addedComponentsets: any = {};
            let changedComponentsets: any = {};
            let deletedComponentsets: any = {};

            for (let componentset in rawComponetsets) {
                if (!res.componentsets[componentset]) {
                    addedComponentsets[componentset] = rawComponetsets[componentset];
                    continue;
                }

                if (JSON.stringify(rawComponetsets[componentset]) !== JSON.stringify(res.componentsets[componentset])) {
                    changedComponentsets[componentset] = rawComponetsets[componentset];
                }

                delete (res.componentsets[componentset]);
            }

            deletedComponentsets = res.componentsets;

            let postData = {
                add: addedComponentsets,
                update: changedComponentsets,
                delete: deletedComponentsets
            };

            this.backend.postRequest('configuration/spiceui/core/componentsets', {}, postData).subscribe((res: any) => {
                this.broadcast.broadcastMessage('metadata.updatecomponentsets', postData);
                this.toast.sendToast('changes saved');
            });

        });
    }


}
