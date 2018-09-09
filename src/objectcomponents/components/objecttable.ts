import {
    Component, EventEmitter, HostBinding,
    Input, OnInit, Output,
} from '@angular/core';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

declare var _;

/**
 * a generic object table component, used to display an array of objects, providing features like selecting, editing (coming), sorting (coming), pagination (coming)
 * todo: adding editing, sorting, pagination features!
 * created by: sebastian franz at 2018-07-16
 */
@Component({
    selector: 'object-table',
    templateUrl: './app/objectcomponents/templates/objecttable.html'
})
export class ObjectTable implements OnInit
{
    @Input() module:string;
    @Input() fieldset_id:string;
    @Input() fields = [];
    @Input() objects = [];
    @Input() selected_objects:any = [];

    private _selectable = false;
    private _multiselect = false;
    @Input('max-selections') max_selections = 0;

    @Output('selected_objectsChange') selected_objects$ = new EventEmitter();
    @Output('select') select$ = new EventEmitter();

    constructor(
        private language: language,
        private metadata: metadata
    ) {

    }

    ngOnInit()
    {
        if(!this.fields || this.fields.length == 0)
        {
            if(this.fieldset_id)
                this.fields = this.metadata.getFieldSetFields(this.fieldset_id);
            else{
                // try to find the default listview...
                let cmpconf = this.metadata.getComponentConfig('ObjectList', this.module);
                this.fields = this.metadata.getFieldSetFields(cmpconf.fieldset);
            }
        }
        if(!this.fields || this.fields.length == 0)
            throw new Error(`No fields given, nor found for module ${this.module}`);

        if(this.selectable && this.max_selections < 1)
            this.max_selections = 1;

        if(this.multiselect && this.max_selections < 2)
            this.max_selections = 99;   // duh... infinite? maybe -99 ...

    }

    // only static via attribute allowed!
    @Input()
    get selectable():boolean { return this._selectable; }
    set selectable(value) {
        this._selectable = true;
    }

    // only static via attribute allowed!
    @Input()
    get multiselect():boolean { return this._multiselect; }
    set multiselect(value) {
        this._multiselect = true;
    }

    toggleAll()
    {
        if(this.selected_objects.length < this.objects.length)
            this.selected_objects = this.objects;
        else
            this.selected_objects = [];

        this.selected_objects$.emit(this.selected_objects);
        this.select$.emit(this.selected_objects);
    }

    select(object)
    {
        if(!this.findSelectedObject(object) && this.selected_objects.length < this.max_selections)
        {
            this.selected_objects.push(object);
            this.selected_objects$.emit(this.selected_objects);
            this.select$.emit(this.selected_objects);
        }
    }

    unselect(object)
    {
        let idx = this.selected_objects.findIndex(e => e.id == object.id);
        if(idx > -1)
        {
            this.selected_objects.splice(idx, 1);
            this.selected_objects$.emit(this.selected_objects);
            this.select$.emit(this.selected_objects);
        }
    }

    isObjectSelected(object)
    {
        if(this.findSelectedObject(object))
        {
            return true;
        }
        else
            return false;
    }

    private findSelectedObject(object)
    {
        return this.selected_objects.find(e => e.id == object.id);
    }

}