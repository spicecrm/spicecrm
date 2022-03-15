/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'componensetmanager-add-dialog',
    templateUrl: '../templates/componentsetmanageradddialog.html'
})
export class ComponentsetManagerAddDialog {
    @Input() public module: string = '';
    @Input() public parent: string = '';

    public component: string = '';
    public systemmodule: string = '';
    public systemmodules: any[] = [];
    public showDeprecatedWarning: boolean = false;

    /**
     * reference to the modal self
     */
    public self;

    /**
     * a text string to filter modules
     *
     * @private
     */
    public moduleFilter: string;

    /**
     * a text string for component filter
     *
     * @private
     */
    public componentFilter: string;

    constructor(public backend: backend, public metadata: metadata, public language: language, public modelutilities: modelutilities) {
        this.systemmodules = this.metadata.getSystemModules();
    }

    /**
     * getter function for the components
     */
    get components() {
        if (!this.componentFilter) return this.metadata.getSystemComponents(this.systemmodule);

        return this.metadata.getSystemComponents(this.systemmodule).filter(c => c.component.toLowerCase().indexOf(this.componentFilter.toLowerCase()) >= 0);

    }

    /**
     * getter for the modules filtered by the searchterm
     */
    get filteredmodules() {
        if (!this.moduleFilter) return this.systemmodules;

        return this.systemmodules.filter(m => m.module.toLowerCase().indexOf(this.moduleFilter.toLowerCase()) >= 0);
    }

    /**
     * gets teh component name and adds a deprecated info
     * @param component
     * @private
     */
    public componentName(component) {
        if (component) {
            if (component.deprecated == '1') {
                return component.component + ' | dep.';
            } else {
                return component.component;
            }
        }
        return '';

    }

    /**
     * closes the dialog
     * @private
     */
    public cancelDialog() {
        this.self.destroy();
    }

    /**
     * reacts to the escape
     * @private
     */
    public onModalEscX() {
        this.cancelDialog();
    }

    /**
     * adds the component
     * @private
     */
    public add() {
        this.metadata.addComponentToComponentset(this.modelutilities.generateGuid(), this.parent, this.component);
        this.self.destroy();
    }

    public checkDep(event) {
        let object = this.components.find(x => x.component === event);
        if (object.deprecated == '1') {
            this.showDeprecatedWarning = true;
        } else {
            this.showDeprecatedWarning = false;
        }
    }
}
