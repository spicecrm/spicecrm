import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {Subject} from 'rxjs';
import { ComponentsetManagerEditDialog } from './componentsetmanagereditdialog';
import { modal } from '../../services/modal.service';
import { ComponentsetManagerAddDialog } from './componentsetmanageradddialog';
import { view } from '../../services/view.service';
import {configurationService} from '../../services/configuration.service';

@Component({
    templateUrl: './src/workbench/templates/componentsetmanager.html',
    providers: [view]
})
export class ComponentsetManager {

    edit_mode: string = "custom";
    allowBarButtons: boolean = true;
    // crNoneActive: boolean = false;

    change_request_required: boolean = false;

    sysModules: Array<any> = [];
    currentModule: string = '*';
    currentComponentSet: string = '';
    currentComponentSetItems: Array<any> = [];
    selectedId: string = '';
    selectedComponent: any = {};

    showAddDialog: boolean = false;
    showComponentsetDetails: boolean = false;

    constructor(private backend: backend,
                private metadata: metadata,
                private language: language,
                private modelutilities: modelutilities,
                private broadcast: broadcast,
                private toast: toast,
                private modalservice: modal,
                private view: view,
                private configurationService: configurationService,) {

        this.backend.getRequest('spiceui/admin/modules').subscribe(modules => {
            this.sysModules = modules;

            // iniutialize the metadata service
            this.metadata.loadFieldSets(new Subject<any>());
            this.metadata.loadComponents(new Subject<any>());
        });
        this.checkMode();
    }


    checkMode(){
        this.edit_mode = this.configurationService.getCapabilityConfig('core').edit_mode;
        this.change_request_required = this.configurationService.getCapabilityConfig('systemdeployment').change_request_required ? true : false;

        if(!(this.edit_mode == 'none' || this.edit_mode == 'custom' || this.edit_mode == 'all')){
            this.edit_mode = 'custom';
        }

        if(this.change_request_required){
            this.backend.getRequest('systemdeploymentcrs/active').subscribe(crresponse => {
                if (crresponse.id == "") {
                    this.setNoneMode();
                    // this.crNoneActive = true;
                    this.toast.sendToast(this.language.getLabel('LBL_ACTIVATE_CR_WARNING'), 'warning', null, 3);
                }else{
                    // this.crNoneActive = false;
                    if(this.edit_mode == "all"){
                        this.setAllMode();
                    }else if(this.edit_mode == "custom"){
                        this.setCustomMode();
                    }else{
                        this.setNoneMode();
                    }
                }
            })
        }else{
            // this.crNoneActive = false;
            if(this.edit_mode == "all"){
                this.setAllMode();
            }else if(this.edit_mode == "custom"){
                this.setCustomMode();
            }else{
                this.setNoneMode();
            }
        }
    }

    setNoneMode(){
        this.view.setViewMode();
        this.allowBarButtons = false;
    }
    setCustomMode(){
        if(this.componentSetType == "custom"){
            this.view.setEditMode();
        }else{
            this.view.setViewMode();
        }
    }
    setAllMode(){
        this.view.setEditMode();
    }




    get showDetailIcon() {
        return this.showComponentsetDetails ? 'chevronup' : 'chevrondown';
    }

    toggleDetail() {
        this.showComponentsetDetails = !this.showComponentsetDetails;
    }

    get componentSetType() {
        if (this.currentComponentSet)
            return this.metadata.getComponentSet(this.currentComponentSet).type;
        else
            return '';
    }

    get currentComponentSetPackage(){
        return this.metadata.getComponentSet(this.currentComponentSet).package;
    }
    set currentComponentSetPackage(newPackage){
        let componentset = this.metadata.getComponentSet(this.currentComponentSet);
        componentset.package = newPackage;
    }
    get currentComponentSetName(){
        return this.metadata.getComponentSet(this.currentComponentSet).name;
    }
    set currentComponentSetName(newName){
        let componentset = this.metadata.getComponentSet(this.currentComponentSet);
        componentset.name = newName;
    }

    getComponentSetItemName(componentsetItem){
        if(componentsetItem.componentconfig.name){
            return '(' + this.language.getAppLanglabel(componentsetItem.componentconfig.name) + ')';
        }

        if(componentsetItem.componentconfig.object){
            return '(' + this.language.getModuleName(componentsetItem.componentconfig.object) + ')';
        }
    }

    getComponentSets(type = undefined) {
        if(!type) {
            return this.metadata.getComponentSets(this.currentModule);
        } else {
            let retArray = [];
            let componentsets = this.metadata.getComponentSets(this.currentModule);

            for(let componentset of componentsets){
                if(componentset.type == type){
                    retArray.push(componentset);
                }
            }

            return retArray;
        }
    }

    getComponentSetItems() {
        return this.currentComponentSet ? this.metadata.getComponentSetObjects(this.currentComponentSet) : [];
    }

    selectItem(item) {
        this.selectedId = item.id;
        this.selectedComponent = item;
    }

    isSelected(id) {
        return id == this.selectedId;
    }

    getComponentsetConfig() {
        if (this.selectedComponent.componentconfig)
            return JSON.stringify(this.selectedComponent.componentconfig);
    }

    reset() {
        this.selectedId = '';
        this.selectedComponent = {};
        this.currentComponentSet = '';
    }

    selectComponentSet() {
        this.checkMode();
        this.selectedId = '';
        this.selectedComponent = {};
    }

    addComponent() {
        this.showAddDialog = true;
        this.modalservice.openModal('ComponentsetManagerAddDialog').subscribe( modal => {
            modal.instance.module = this.currentModule;
            modal.instance.parent = this.currentComponentSet;
        });
    }

    addComponentset() {
        this.reset();
        this.editComponentset();
    }

    editComponentset() {
        this.modalservice.openModal( 'ComponentsetManagerEditDialog' ).subscribe( modal => {
            modal.instance.componentset = this.currentComponentSet;
            modal.instance.edit_mode = this.edit_mode;
            modal.instance.closedialog.subscribe( componentset => {
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

    deleteComponent(item) {
        let componentsetItems = this.metadata.getComponentSetObjects(this.currentComponentSet);

        // get the current index in the array
        let currentIndex = 0;
        componentsetItems.some((someitem, someindex) => {
            if (someitem.id == item.id) {
                currentIndex = someindex;
                componentsetItems.splice(currentIndex, 1);
                return true;
            }
        });
    }

    moveDown(item) {
        let componentsetItems = this.metadata.getComponentSetObjects(this.currentComponentSet);

        // get the current ind ex in the array
        let currentIndex = 0;
        componentsetItems.some((someitem, someindex) => {
            if (someitem.id == item.id) {
                currentIndex = someindex;
                return true;
            }
        });
        if (currentIndex < componentsetItems.length - 1) {
            // shuffle
            let currentItem = componentsetItems.splice(currentIndex, 1);
            componentsetItems.splice(currentIndex + 1, 0, currentItem[0]);

            // renumber
            let i = 0;
            for (let item of componentsetItems) {
                item.sequence = i;
                i++;
            }
        }
    }

    moveUp(item) {
        let componentsetItems = this.metadata.getComponentSetObjects(this.currentComponentSet);

        // get the current ind ex in the array
        let currentIndex = 0;
        componentsetItems.some((someitem, someindex) => {
            if (someitem.id == item.id) {
                currentIndex = someindex;
                return true;
            }
        });

        if (currentIndex > 0) {
            // shuffle
            let currentItem = componentsetItems.splice(currentIndex, 1);
            componentsetItems.splice(currentIndex - 1, 0, currentItem[0]);

            // renumber
            let i = 0;
            for (let item of componentsetItems) {
                item.sequence = i;
                i++;
            }
        }
    }

    saveChanges() {

        this.backend.getRequest('spiceui/core/components').subscribe((res: any) => {

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

                delete(res.componentsets[componentset]);
            }

            deletedComponentsets = res.componentsets;

            let postData = {
                add: addedComponentsets,
                update: changedComponentsets,
                delete: deletedComponentsets
            };

            this.backend.postRequest('spiceui/core/componentsets', {}, postData).subscribe((res: any) => {
                this.broadcast.broadcastMessage('metadata.updatecomponentsets', postData);
                this.toast.sendToast('changes saved');
            });

        })
    }
}