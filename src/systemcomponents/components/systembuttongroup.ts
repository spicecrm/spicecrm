import {Component, Input, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-button-group',
    templateUrl: './src/systemcomponents/templates/systembuttongroup.html'
})
export class SystemButtonGroup{
    @Input() items: Array<any> = [];
    @Output() action: EventEmitter<string> = new EventEmitter<string>();

    isOpen = false;

    constructor(private metadata: metadata) {}

    toggleOpen(){
        this.isOpen = !this.isOpen;
    }

}
