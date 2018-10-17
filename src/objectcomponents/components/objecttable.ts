import {
    Attribute,
    Component, EventEmitter, HostBinding,
    Input, OnInit, Output,
} from '@angular/core';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from "../../services/modelutilities.service";

declare var _;

/**
 * a generic object table component, used to display an array of objects, providing features like selecting, editing (coming), sorting (coming), pagination (coming)
 * todo: adding editing, sorting, pagination features!
 * created by: sebastian franz at 2018-07-16
 * update: changed selectable and multiselect to attributes
 */
@Component({
    selector: 'object-table',
    templateUrl: './src/objectcomponents/templates/objecttable.html'
})
export class ObjectTable implements OnInit {
    @Input() public fields = [];
    @Input() public objects = [];
    @Input() public selected_objects: any = [];

    @Input("fieldset_id") private fieldset_id: string;
    @Input("module") private module: string;

    @Output('selected_objectsChange') public selected_objects$ = new EventEmitter();
    @Input('max-selections') public max_selections = 0;
    @Output('select') public select$ = new EventEmitter();
    private selectable = false;
    private multiselect = false;

    constructor(
        private language: language,
        private metadata: metadata,
        // @Attribute("fieldset_id") private fieldset_id: string,
        // @Attribute("module") private module: string,
        @Attribute("selectable") selectable: string,
        @Attribute("multiselect") multiselect: string,
    ) {
        // only null is false... everything else is true!
        this.selectable = selectable !== null;
        this.multiselect = multiselect !== null;
    }

    public ngOnInit() {
        if (!this.fields || this.fields.length == 0) {
            if (this.fieldset_id) {
                this.fields = this.metadata.getFieldSetFields(this.fieldset_id);
            } else {
                // try to find the default listview...
                let cmpconf = this.metadata.getComponentConfig('ObjectList', this.module);
                this.fields = this.metadata.getFieldSetFields(cmpconf.fieldset);
            }
        }
        if (!this.fields || this.fields.length == 0) {
            throw new Error(`No fields given, nor found for module ${this.module}`);
        }

        if (this.selectable && this.max_selections < 1) {
            this.max_selections = 1;
        }

        if (this.multiselect && this.max_selections < 2) {
            this.max_selections = 99;   // duh... infinite? maybe -99 ...
        }
    }

    public toggleAll() {
        if (this.selected_objects.length < this.objects.length) {
            this.selected_objects = [...this.objects];
        } else {
            this.selected_objects = [];
        }

        this.selected_objects$.emit(this.selected_objects);
        this.select$.emit(this.selected_objects);
    }

    public select(object) {
        if (!this.findSelectedObject(object) && this.selected_objects.length < this.max_selections) {
            this.selected_objects.push(object);
            this.selected_objects$.emit(this.selected_objects);
            this.select$.emit(this.selected_objects);
        }
    }

    public unselect(object) {
        let idx = this.selected_objects.findIndex(e => e.id == object.id);
        if (idx > -1) {
            this.selected_objects.splice(idx, 1);
            this.selected_objects$.emit(this.selected_objects);
            this.select$.emit(this.selected_objects);
        }
    }

    private isObjectSelected(object) {
        if (this.findSelectedObject(object)) {
            return true;
        } else {
            return false;
        }
    }

    private areAllObjectsSelected() {
        return this.selected_objects.length == this.objects.length;
    }

    private findSelectedObject(object) {
        return this.selected_objects.find(e => e.id == object.id);
    }

}