/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    Output,
    OnInit,
    EventEmitter,
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';


@Component({
    selector: 'objectrepositorymanager-add-repo',
    templateUrl: './src/workbench/templates/objectrepositorymanageraddrepo.html'
})
export class ObjectRepositoryManagerAddRepo implements OnInit {
    @Output() closedialog: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() objRepo: any = {
        component: "",
        componentconfig: "",
        description: "",
        id: "",
        module: "",
        object: "",
        package: ""
    };

    currentObject: string = '';
    currentComponent: string = '';

    addType: string = 'fieldsetadd';
    addName: string = '';
    addFieldset: string = '';
    fieldsettype: string = 'custom';
    moduleFields: Array<any> = [];
    self;

    constructor(private backend: backend, private language: language, private modelutilities: modelutilities) {

    }

    ngOnInit() {

    }

    closeDialog() {
        this.self.destroy();
    }

    onModalEscX() {
        this.closeDialog();
    }

    add() {
        this.closedialog.emit(true);
        this.self.destroy();
    }

    copyObject(){
        this.objRepo.component = this.objRepo.object;
    }
}