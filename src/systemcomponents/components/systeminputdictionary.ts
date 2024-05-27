import {Component, forwardRef, Input} from '@angular/core';
import {DictionaryDefinition} from "../../workbench/interfaces/dictionarymanager.interfaces";
import {configurationService} from "../../services/configuration.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-dictionary',
    templateUrl: '../templates/systeminputdictionary.html',
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemInputDictionary)
    }]
})

export class SystemInputDictionary implements ControlValueAccessor {

    /**
     * holds the disabled flag
     */
    @Input() public disabled: boolean = false;
    /**
     * holds the dictionaries array
     */
    public dictionaries: DictionaryDefinition[] = [];
    /**
     * holds the selected dictionary id
     */
    public dictionary: DictionaryDefinition;

    public onChange: (id: string) => void;

    constructor(private configurationService: configurationService) {
        this.loadDictionaries();
    }

    /**
     * load dictionaries from backend
     * @private
     */
    private loadDictionaries() {

        this.dictionaries = this.configurationService.getData('sysdictionarydefinitions');
    }

    /**
     * register the on change function for ngModel
     * @param fn
     */
    registerOnChange(fn: any): void {
        this.onChange = (id: string) => fn(id);
    }

    registerOnTouched(): void {}

    /**
     * write the input value to the local property
     * @param id
     */
    writeValue(id: string): void {

        if (this.dictionaries.length == 0) {
            this.loadDictionaries();
        }

        this.dictionary = this.dictionaries.find(d => d.id == id);
    }
}