/**
 * @module SystemComponents
 */
import {
    Component,
    forwardRef, Input,
    OnDestroy,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {language} from "../../services/language.service";
import {modelutilities} from "../../services/modelutilities.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: "system-input-label",
    templateUrl: "../templates/systeminputlabel.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputLabel),
            multi: true
        }
    ]
})
export class SystemInputLabel implements OnDestroy, ControlValueAccessor {

    /**
     * to disable the checkbox
     */
    public _disabled = false;
    @Input('disabled') set disabled(value) {
        if (value === false) {
            this._disabled = false;
        } else {
            this._disabled = true;
        }
    }

    /**
     * set to tru to just display the label and not the technical name
     */
    public _hideTechnicalName = false;
    @Input('hideTechnicalName') set hideTechnicalName(value) {
        if (value === false) {
            this._hideTechnicalName = false;
        } else {
            this._hideTechnicalName = true;
        }
    }

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;
    public _time: any = {
        display: '',
        moment: null,
        offset: 0,
        valid: true
    };

    @Input()
    public label: string = '';

    // for the dropdown
    public _searchterm: string = '';
    public clickListener: any;
    public foundlabels: any[] = [];
    public activeLabel: number = -1;

    constructor(
        public language: language,
        public modal: modal,
        public modelutilities: modelutilities
    ) {
    }

    get isOpen() {
        return this._searchterm != '';
    }

    get searchterm() {
        return this._searchterm;
    }

    set searchterm(st) {
        this._searchterm = st;
        this.dosearch();
        this.activeLabel = -1;
    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    public onBlur() {
        this._searchterm = '';
        this.activeLabel = -1;
    }

    public dosearch() {
        if (this._searchterm) {
            this.foundlabels = this.language.searchLabel(this._searchterm, 50);
        } else {
            this.foundlabels = [];
        }
    }

    public selectLabel(label) {
        this.label = label;
        this._searchterm = '';
        this.onChange(label);
        this.activeLabel = -1;
    }

    public clearField() {
        this.label = '';
        this.onChange('');
    }

    public keyup(_e) {
        switch (_e.key) {
            case 'Enter':
                this.label = this.activeLabel == -1 ? this._searchterm : this.foundlabels[this.activeLabel].label;
                this.onChange(this.label);
                this._searchterm = '';
                break;
            case 'ArrowDown':
                if (this.activeLabel < this.foundlabels.length - 1) {
                    this.activeLabel++;
                }
                break;
            case 'ArrowUp':
                if (this.activeLabel > 0) {
                    this.activeLabel--;
                }
                break;
        }
    }

    public trackByFn(index, item) {
        return item.id;
    }

    public addLabel() {
        let label = {
            id: this.modelutilities.generateGuid(),
            name: '',
            scope: 'custom',
            custom_translations: [],
            global_translations: [],
        };
        label.custom_translations.push(
            {
                id: this.modelutilities.generateGuid(),
                syslanguagelabel_id: label.id,
                syslanguage: this.language.languagedata.languages.default,
            }
        );
        this.modal.openModal('LanguageLabelModal').subscribe(modal => {
            modal.instance.label = label;
            modal.instance.label$.subscribe(value => {
                if (value) {
                    this.label = value.name;
                    this.onChange(this.label);
                }
            });
        });
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
        if(!value) return

        this.label = value;
    }

}
