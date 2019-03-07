/**
 * @module ModuleACL
 */
import {
    Component,
    EventEmitter,
    Input,
    OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';


@Component({
    selector: 'acltypes-manager-types-add-fields',
    templateUrl: './src/modules/acl/templates/acltypesmanagertypesaddfields.html',
})
export class ACLTypesManagerTypesAddFields implements OnInit {

    @Input() private module: string = '';
    private self: any = {};
    private currentfields: any[] = [];
    private fields: any[] = [];
    private field: string = '';
    private addfield: EventEmitter<string> = new EventEmitter<string>();

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities) {

    }

    public ngOnInit() {
        let fields = this.metadata.getModuleFields(this.module);

        let activeFields = [];
        for (let currentField of this.currentfields) {
            activeFields.push(currentField.name);
        }

        for (let field in fields) {
            if (this.allowField(fields[field]) && activeFields.indexOf(field) < 0)
                this.fields.push(field);
        }

    }

    private allowField(field) {
        return field.source != 'non-db' && field.type != 'link' && field.type != 'relate';
    }

    private close() {
        this.self.destroy();
    }

    private add() {
        this.addfield.emit(this.field);
        this.close();
    }
}
