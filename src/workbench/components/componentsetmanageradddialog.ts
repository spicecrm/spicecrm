import {
    Component,
    Input,
    Output,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    EventEmitter,
} from '@angular/core';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';

import {Subject} from 'rxjs';
import {field} from "../../objectfields/components/field";

@Component({
    selector: 'componensetmanager-add-dialog',
    templateUrl: './src/workbench/templates/componentsetmanageradddialog.html'
})
export class ComponentsetManagerAddDialog  {
    @Input() module: string = '';
    @Input() parent: string = '';

    component: string = '';
    self;

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities) {

    }

    cancelDialog() {
        this.self.destroy();
    }

    onModalEscX() {
        this.cancelDialog();
    }

    add() {
        this.metadata.addComponentToComponentset(this.modelutilities.generateGuid(), this.parent, this.component);
        this.self.destroy();
    }

    getComponents() {
        return this.metadata.getSystemComponents();
    }

}