/**
 * @module WorkbenchModule
 */
import {
    Component, forwardRef, Input
} from '@angular/core';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'system-input-relate',
    templateUrl: './src/systemcomponents/templates/systeminputrelate.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputRelate),
            multi: true
        }
    ]
})
export class SystemInputRelate implements ControlValueAccessor {

    /**
     * for the value accessor
     */
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * the module so the enum can be determined
     */
    @Input() private module: string;

    /**
     * The field of the related name.
     */
    @Input() private nameField = 'summary_text';

    /**
     * the related id
     */
    private _relatedid: string;

    /**
     * the related id
     */
    private _relatedname: string;


    constructor(private language: language, private modal: modal
    ) {

    }

    private clearField() {
        this._relatedid = undefined;
        this._relatedname = undefined;
        this.onChange(undefined);
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
        if (value) {
            let valArray = value.split('::');
            this._relatedid = valArray[0];
            this._relatedname = valArray[1];
        }
        this._relatedid = value;
    }


    /**
     * opens a search modal
     */
    private searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.module;
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    this._relatedid = items[0].id;
                    this._relatedname = items[0][this.nameField];
                    this.onChange(this._relatedid + '::' + this._relatedname);
                }
            });
        });
    }
}
