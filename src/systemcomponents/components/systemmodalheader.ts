import {Component, Input, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-modal-header',
    templateUrl: './src/systemcomponents/templates/systemmodalheader.html'
})
export class SystemModalHeader {
    @Input() private module: string = '';
    @Input() private hiddenCloseButton = false;
    @Output() private close: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private metadata: metadata, private language: language) {

    }
}
