import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";

@Component({
    selector: 'componentsetmanager-componentset-details',
    templateUrl: './src/workbench/templates/componentsetmanagercomponentsetdetails.html'
})
export class ComponentsetManagerComponentsetDetails implements OnChanges {


    @Input() component: any = {};

    configcomponent: string = "";
    configValues: any = {};

    selectedComponent: any = {};

    constructor(private view: view, private language: language,) {
    }

    selectComponent(component) {
        if (component.id)
            this.selectedComponent = component;
        else
            this.selectedComponent = {};
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.component.component) {
            this.selectComponent(this.component);

            this.configcomponent = this.component.component;
            this.configValues = this.component.componentconfig;
        }
    }

}