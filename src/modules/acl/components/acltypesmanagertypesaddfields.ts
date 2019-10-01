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

/**
 * renders a modal with a selection of fields for the mldule to be added in the ACL Componentes
 */
@Component({
    selector: 'acltypes-manager-types-add-fields',
    templateUrl: './src/modules/acl/templates/acltypesmanagertypesaddfields.html',
})
export class ACLTypesManagerTypesAddFields implements OnInit {

    /**
     * the module
     */
    @Input() private module: string = '';

    /**
     * reference to self for the modal
     */
    private self: any = {};

    /**
     * an array with already used fields
     */
    private currentfields: any[] = [];

    /**
     * the fields to be presented as selection options
     */
    private fields: any[] = [];

    /**
     * the selcted field
     */
    private field: string = '';

    /**
     * event emitter provided to be subscribed by the component opening the modal
     */
    private addfield: EventEmitter<string> = new EventEmitter<string>();

    /**
     * parameter to set to true if no filter for nondb or orhter shoudlk be added.
     *
     * Since the same dialog is also used for the screen control this is then set accordingly
     */
    private showAll: boolean = false;

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities) {

    }

    public ngOnInit() {
        let fields = this.metadata.getModuleFields(this.module);

        let activeFields = [];
        for (let currentField of this.currentfields) {
            activeFields.push(currentField.name);
        }

        for (let field in fields) {
            if ((this.showAll || this.allowField(fields[field])) && activeFields.indexOf(field) < 0) {
                this.fields.push(field);
            }
        }

        this.fields.sort();

    }

    /**
     * checks if the field can be used ... not available for non-db fields
     *
     * @param field the fieldname
     */
    private allowField(field) {
        return field.source != 'non-db' && field.type != 'link' && field.type != 'relate';
    }

    /**
     * returns the translated name of the field
     *
     * @param field the field name
     */
    private getFieldDisplayName(field){
        return this.language.getFieldDisplayName(this.module, field);
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * handler when the add buton is pushed
     */
    private add() {
        this.addfield.emit(this.field);
        this.close();
    }
}
