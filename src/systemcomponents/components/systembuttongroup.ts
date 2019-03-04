/**
 * @module SystemComponents
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-button-group',
    templateUrl: './src/systemcomponents/templates/systembuttongroup.html'
})
export class SystemButtonGroup{
    @Input() private items: any[] = [];
    @Output() private action: EventEmitter<string> = new EventEmitter<string>();

    private isopen = false;

    constructor(private metadata: metadata) {}

    toggleOpen(){
        this.isopen = !this.isopen;
    }

}
