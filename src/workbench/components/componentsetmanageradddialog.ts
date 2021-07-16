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
    templateUrl: './src/workbench/templates/componentsetmanageradddialog.html'
})
export class ComponentsetManagerAddDialog  {
    @Input() private module: string = '';
    @Input() private parent: string = '';

    private component: string = '';
    private systemmodule: string = '';
    private systemmodules: any[] = [];
    private showDeprecatedWarning: boolean = false;
    public self;

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities) {
        this.systemmodules = this.metadata.getSystemModules();
    }

    get components() {
        return this.metadata.getSystemComponents(this.systemmodule);
    }

    private componentName(component) {
        if(component) {
            if(component.deprecated == '1') {
                return component.component + ' | dep.';
            } else {
                return component.component;
            }
        }
        return '';

    }

    private cancelDialog() {
        this.self.destroy();
    }

    private onModalEscX() {
        this.cancelDialog();
    }

    private add() {
        this.metadata.addComponentToComponentset(this.modelutilities.generateGuid(), this.parent, this.component);
        this.self.destroy();
    }

    private checkDep(event) {
        let object = this.components.find(x => x.component === event);
        if(object.deprecated == '1') {
            this.showDeprecatedWarning = true;
        } else {
            this.showDeprecatedWarning = false;
        }
    }
}
