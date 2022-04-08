/**
 * @module SystemComponents
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-button-group',
    templateUrl: '../templates/systembuttongroup.html'
})
export class SystemButtonGroup{
    @Input() public items: any[] = [];
    @Output() public action: EventEmitter<string> = new EventEmitter<string>();

    public isopen = false;

    constructor(public metadata: metadata) {}

    toggleOpen(){
        this.isopen = !this.isopen;
    }

}
