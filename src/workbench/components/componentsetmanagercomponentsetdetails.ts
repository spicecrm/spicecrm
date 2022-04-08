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
    templateUrl: '../templates/componentsetmanagercomponentsetdetails.html'
})
export class ComponentsetManagerComponentsetDetails implements OnChanges {

    /**
     * the component as input
     */
    @Input() public component: any = {};

    public configcomponent: string = "";
    public configValues: any = {};

    public selectedComponent: any = {};

    constructor(public view: view, public language: language,) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (this.component.component) {
            this.selectComponent(this.component);

            this.configcomponent = this.component.component;
            this.configValues = this.component.componentconfig;
        }
    }


    public selectComponent(component) {
        if (component.id) {
            this.selectedComponent = component;
        } else {
            this.selectedComponent = {};
        }
    }
}
