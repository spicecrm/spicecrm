import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-modal-footer',
    templateUrl: './src/systemcomponents/templates/systemmodalfooter.html'
})
export class SystemModalFooter {

    constructor(private metadata: metadata) {

    }
}