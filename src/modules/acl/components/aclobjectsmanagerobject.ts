/**
 * @module ModuleACL
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    Input,
    OnChanges, SimpleChanges
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {aclobjectsmanager} from "../services/aclobjectsmanager.service";

@Component({
    selector: 'aclobjects-manager-object',
    templateUrl: '../templates/aclobjectsmanagerobject.html',
    providers: [view]
})
export class ACLObjectsManagerObject implements OnChanges {

    /**
     * the id of the object
     */
    @Input() public objectid: string = '';

    /**
     * the status of the object
     */
    @Input() public objectstatus: string = '';

    /**
     * if we are loaded or not
     */
    public loaded: boolean = false;

    public tabs: any[] = [
        // {tab: 'details', label: 'LBL_DETAILS', component: 'ACLObjectsManagerObjectDetails'},
        // {tab: 'fieldvalues', label: 'LBL_FIELDVALUES', component: 'ACLObjectsManagerObjectFieldvalues'},
        // {tab: 'fieldcontrols', label: 'LBL_FIELDCONTROLS', component: 'ACLObjectsManagerObjectFields'},
        // {tab: 'territory', label: 'LBL_SPICEACLTERRITORY'}
    ];
    public activeTab: string = '';

    @ViewChild('header', {read: ViewContainerRef, static: true}) public header: ViewContainerRef;

    constructor(public aclobjectsmanager: aclobjectsmanager, public metadata: metadata, public backend: backend, public model: model, public view: view, public language: language) {


        // get config
        let componentConfig = this.metadata.getComponentConfig('ACLObjectsManagerObject', this.model.module);
        if (componentConfig.componentset) {
            let componentsetObjects = this.metadata.getComponentSetObjects(componentConfig.componentset);
            for (let componentsetObject of componentsetObjects) {
                this.tabs.push({
                    tab: componentsetObject.id,
                    label: componentsetObject.componentconfig.name,
                    component: componentsetObject.component
                });

                // select the first one as active tab
                if (!this.activeTab) {
                    this.activeTab = componentsetObject.id;
                }
            }
        }
    }

    private setEditMode(){
        switch (this.model.getField('status')){
            case 'r':
                this.view.isEditable = false;
                this.view.setViewMode();
                break;
            default:
                this.view.isEditable = true;
                this.view.setEditMode();
                break;
        }
    }

    public switchTab(tab) {
        this.activeTab = tab;
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.loaded = false;
        if (this.objectid || changes['objectid']) {
            this.model.id = this.objectid;
            this.model.initialize();

            let data = this.aclobjectsmanager.aclobjects.find(t => t.id == this.objectid);
            this.model.setData(data);

            // set the edit mode on the view
            this.setEditMode();

            if(this.view.isEditMode()) {
                this.model.startEdit();
            }

            this.loaded = true;
        } else if(changes['objectstatus']){
            // set the edit mode on the view
            this.setEditMode();

            if(this.view.isEditMode()) {
                this.model.startEdit();
            } else {
                this.model.cancelEdit();
            }
        }
    }

    get canSave(){
        return this.model.isDirty();
    }

    public save() {
        this.model.save(true);
    }

}
