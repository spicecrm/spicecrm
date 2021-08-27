/**
 * @module ModuleACL
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    Input,
    OnChanges
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'aclobjects-manager-object',
    templateUrl: './src/modules/acl/templates/aclobjectsmanagerobject.html',
    providers: [model]
})
export class ACLObjectsManagerObject implements OnChanges {

    @Input() private objectid: string = '';
    @Input() private typeid: string = '';
    private loaded: boolean = false;

    private tabs: any[] = [
        // {tab: 'details', label: 'LBL_DETAILS', component: 'ACLObjectsManagerObjectDetails'},
        // {tab: 'fieldvalues', label: 'LBL_FIELDVALUES', component: 'ACLObjectsManagerObjectFieldvalues'},
        // {tab: 'fieldcontrols', label: 'LBL_FIELDCONTROLS', component: 'ACLObjectsManagerObjectFields'},
        // {tab: 'territory', label: 'LBL_SPICEACLTERRITORY'}
    ];
    private activeTab: string = '';

    @ViewChild('header', {read: ViewContainerRef, static: true}) private header: ViewContainerRef;

    constructor(private metadata: metadata, private backend: backend, private model: model, private language: language) {
        this.model.module = 'SpiceACLObjects';

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

    private switchTab(tab) {
        this.activeTab = tab;
    }

    public ngOnChanges() {
        this.loaded = false;
        if (this.objectid) {
            this.model.id = this.objectid;
            this.model.getData(true).subscribe(data => {
                this.loaded = true;
            });
        }
    }

    private save() {
        this.model.save(true);
    }

}
