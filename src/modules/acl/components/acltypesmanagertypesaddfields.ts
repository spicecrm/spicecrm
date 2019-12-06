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
     * all selected fields
     */
    private selectedfields: any[] = [];

    /**
     * the fields to be presented as selection options
     */
    private fields: any[] = [];

    /**
     * event emitter provided to be subscribed by the component opening the modal
     */
    private addfields: EventEmitter<any> = new EventEmitter<any>();

    /**
     * parameter to set to true if no filter for nondb or orhter shoudlk be added.
     *
     * Since the same dialog is also used for the screen control this is then set accordingly
     */
    private showAll: boolean = false;


    /**
     * Flag: if true, the select all checkbox is checked!
     */
    private selectAllChecked: boolean = false;


    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities) {

    }

    public ngOnInit() {
        let fields = this.metadata.getModuleFields(this.module);

        this.selectedfields = [];

        for (let field in fields) {
            if (this.showAll || this.allowField(fields[field])) {
                this.fields.push(field);
            }
        }
        for (let currentField of this.currentfields) {
            this.selectedfields.push(currentField.name);
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
    private getFieldDisplayName(field) {
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
        this.addfields.emit(this.selectedfields);
        this.close();
    }



    private getFieldDisplay(fieldname) {
        for (let currentField of this.currentfields) {
            if (currentField.name == fieldname && currentField.hide) {
                return true;
            }
        }
        return false;
    }

    private getFieldValue(fieldname) {

        for (let field of this.selectedfields) {
            if (field == fieldname) {
                return true;
            }
        }
        return false;
    }
    private setFieldValue(fieldname, event) {
        // stop propagation
        event.preventDefault();

        let found = false;
        for (let key in this.selectedfields) {
            if (this.selectedfields[key] == fieldname) {
                this.selectedfields.splice(+key, 1);
                found = true;
            }
        }
        if(!found) {
            this.selectedfields.push(fieldname);
        }
    }


    private toggleSelectAll(event) {
        // stop propagation
        event.preventDefault();

        if(!this.selectAllChecked) {
            for (let field of this.fields) {
                this.selectedfields.push(field);
            }
            this.selectAllChecked = true;
        } else {
            this.selectAllChecked = false;
            this.selectedfields = [];
        }


    }
}
