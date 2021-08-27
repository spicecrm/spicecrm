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
    templateUrl: './src/workbench/templates/componentsetmanager.html',
    providers: [view]
})
export class ComponentsetManager {

    private edit_mode: string = "custom";
    private allowBarButtons: boolean = true;
    // crNoneActive: boolean = false;

    private change_request_required: boolean = false;

    private sysModules: any[] = [];
    private currentModule: string = '*';
    private currentComponentSet: string = '';
    private currentComponentSetItems: any[] = [];
    private selectedId: string = '';
    private selectedComponent: any = {};

    private showAddDialog: boolean = false;
    private showComponentsetDetails: boolean = false;

    constructor(private backend: backend,
                private metadata: metadata,
                private language: language,
                private modelutilities: modelutilities,
                private broadcast: broadcast,
                private toast: toast,
                private modalservice: modal,
                private view: view,
                private configurationService: configurationService) {

        this.backend.getRequest('system/spiceui/admin/modules').subscribe(modules => {
            this.sysModules = modules;

            // iniutialize the metadata service
            // this.metadata.loadFieldSets(new Subject<any>());
            // this.metadata.loadComponents(new Subject<any>());
        });
        this.checkMode();
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

    private setNoneMode() {
        this.view.setViewMode();
        this.allowBarButtons = false;
    }

    private setCustomMode() {
        if (this.componentSetType == "custom") {
            this.view.setEditMode();
        } else {
            this.view.setViewMode();
        }
    }

    private setAllMode() {
        this.view.setEditMode();
    }


    get showDetailIcon() {
        return this.showComponentsetDetails ? 'chevronup' : 'chevrondown';
    }

    private toggleDetail() {
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

    private componentDeprecated(component) {
        let object = this.metadata.getSystemComponents(component.module).find(x => x.component === component.component);
        if (object.deprecated == '1') {
            return true;
        } else {
            return false;
        }
    }

    private getComponentSetItemName(componentsetItem) {
        if (componentsetItem.componentconfig.name) {
            return `(${this.language.getLabel(componentsetItem.componentconfig.name)})`;
        }

        if (componentsetItem.componentconfig.object) {
            return `(${this.language.getModuleName(componentsetItem.componentconfig.object)})`;
        }
    }

    private getComponentSets(type?) {
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

    private getComponentSetItems() {
        return this.currentComponentSet ? this.metadata.getComponentSetObjects(this.currentComponentSet) : [];
    }

    private selectItem(item) {
        this.selectedId = item.id;
        this.selectedComponent = item;
    }

    private isSelected(id) {
        return id == this.selectedId;
    }

    private getComponentsetConfig() {
        if (this.selectedComponent.componentconfig) {
            return JSON.stringify(this.selectedComponent.componentconfig);
        }
    }

    private reset() {
        this.selectedId = '';
        this.selectedComponent = {};
        this.currentComponentSet = '';
    }

    private selectComponentSet() {
        this.checkMode();
        this.selectedId = '';
        this.selectedComponent = {};
    }

    private addComponent() {
        this.showAddDialog = true;
        this.modalservice.openModal('ComponentsetManagerAddDialog').subscribe(modal => {
            modal.instance.module = this.currentModule;
            modal.instance.parent = this.currentComponentSet;
        });
    }

    private addComponentset() {
        this.reset();
        this.editComponentset();
    }

    private editComponentset() {
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
    private deleteComponent(item) {
        let componentsetItems = this.metadata.getComponentSetObjects(this.currentComponentSet);
        componentsetItems.splice(componentsetItems.findIndex(c => c.id == item.id), 1);
    }

    /**
     * handles the drop event and rearranges the array
     * @param event
     */
    private drop(event) {
        let componentsetItems = this.metadata.getComponentSetObjects(this.currentComponentSet);
        componentsetItems.splice(event.currentIndex, 0, componentsetItems.splice(event.previousIndex, 1)[0]);

        // recalculate the sequence
        let sequence = 0;
        for(let componentsetItem of componentsetItems){
            componentsetItem.sequence = sequence;
            sequence++;
        }

    }


    private saveChanges() {

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
