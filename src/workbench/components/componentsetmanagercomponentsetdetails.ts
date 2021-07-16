/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";

/**
 * the details of a component in the componentsetmanager
 */
@Component({
    selector: 'componentsetmanager-componentset-details',
    templateUrl: './src/workbench/templates/componentsetmanagercomponentsetdetails.html'
})
export class ComponentsetManagerComponentsetDetails implements OnChanges {

    /**
     * the component as input
     */
    @Input() public component: any = {};

    private configcomponent: string = "";
    private configValues: any = {};

    private selectedComponent: any = {};

    constructor(private view: view, private language: language,) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (this.component.component) {
            this.selectComponent(this.component);

            this.configcomponent = this.component.component;
            this.configValues = this.component.componentconfig;
        }
    }


    private selectComponent(component) {
        if (component.id) {
            this.selectedComponent = component;
        } else {
            this.selectedComponent = {};
        }
    }
}
