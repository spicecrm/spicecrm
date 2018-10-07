import {
    Component,
    Input,
    Output,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    EventEmitter, Pipe,
} from '@angular/core';
import {model} from '../../services/model.service';
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
    private systemmodules: Array<any> = [];
    public self;

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities) {
        this.systemmodules = this.metadata.getSystemModules();
    }

    get components() {
        return this.metadata.getSystemComponents(this.systemmodule);
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

}
