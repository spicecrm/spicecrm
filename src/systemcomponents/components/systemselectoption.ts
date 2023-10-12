import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-select-option',
    template: ''
})

export class SystemSelectOption {
    /**
     * value of the option
     */
    @Input() public value: string;
    /**
     * value of the option
     */
    @Input() public display: string;
    /**
     * value of the option
     */
    @Input() public group: string;

}