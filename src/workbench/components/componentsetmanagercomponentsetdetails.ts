import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    OnChanges, SimpleChanges
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";

@Component({
    selector: 'componentsetmanager-componentset-details',
    templateUrl: './src/workbench/templates/componentsetmanagercomponentsetdetails.html'
})
export class ComponentsetManagerComponentsetDetails implements OnChanges {


    @Input() component: any = {};
    configOptions: Array<any> = [];

    optionsElements: Array<any> = [];
    selectedComponent: any = {};
    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private view: view
    ) {

    }

    selectComponent(component) {
        if (component.id)
            this.selectedComponent = component;
        else
            this.selectedComponent = {};
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log("this.metadata2", this.metadata);
        if (this.component.component) {
            this.selectComponent(this.component);
        }
    }

    getComponentsetConfig() {
        if (this.component.componentconfig)
            return JSON.stringify(this.component.componentconfig);
    }

}