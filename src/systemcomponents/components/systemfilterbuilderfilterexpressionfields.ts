/**
 * @module WorkbenchModule
 */
import {Component, forwardRef, Input, OnChanges} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-filter-builder-expression-fields',
    templateUrl: '../templates/systemfilterbuilderfilterexpressionfields.html',
    providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemFilterBuilderFilterExpressionFields),
        multi: true
    }
]
})
export class SystemFilterBuilderFilterExpressionFields implements OnChanges, ControlValueAccessor {

    /**
     * for the value accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * the module we are attaching this filter to
     */
    @Input() public module: string;
    /**
     * flag to display all fields
     * @private
     */
    @Input() private displayAllFields: boolean = false;

    public fields: any[] = [];

    public _field: string;


    constructor(
        public language: language,
        public metadata: metadata,
    ) {

    }

    get field() {
        return this._field;
    }

    set field(field) {
        if (field != this._field) {
            this._field = field;
            this.onChange(field);
        }
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue(value: any): void {
        this._field = value;
    }

    public ngOnChanges() {
        this.buildFieldOptions();
    }

    /**
     * load the fields and sort them
     */
    private buildFieldOptions() {

        this.fields = [];

        if (!this.module) return;

        let fields = this.metadata.getModuleFields(this.module);
        for (let field in fields) {

            if (!this.displayAllFields && !(fields[field].type == 'linked' && fields[field].name == 'assigned_user')) {
                // no links
                if(fields[field].type == 'link') continue;

                // no relate fields if no module is set or the relate is non db
                if(fields[field].type == 'relate') {
                    if(!fields[field].module) continue;
                    if(fields[field].id_name && fields[fields[field].id_name] && fields[fields[field].id_name].source == 'non-db') continue;
                }

                // no id fields
                if(fields[field].type == 'id') continue;

                // no non-db fields
                if(fields[field].source == 'non-db' && fields[field].type != 'relate') continue;
            }

            this.fields.push({
                ...fields[field],
                displayName: this.language.getFieldDisplayName(this.module, fields[field].name)
            });
        }

        // sort the fields
        this.fields.sort((a, b) => a.displayName.toLowerCase() > b.displayName.toLowerCase() ? 1 : -1);
    }

}
