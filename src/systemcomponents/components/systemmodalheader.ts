import {Component, Input, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-modal-header',
    templateUrl: './src/systemcomponents/templates/systemmodalheader.html'
})
export class SystemModalHeader {

    @Input() module: string = '';

    @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private metadata: metadata) {

    }

}