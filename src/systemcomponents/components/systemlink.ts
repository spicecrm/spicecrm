/**
 * @module SystemComponents
 */
import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'system-link',
    templateUrl: './src/systemcomponents/templates/systemlink.html'
})
export class SystemLink {

    @Output() private click: EventEmitter<any> = new EventEmitter<any>();

    private clicked(event) {
        this.click.emit(event);
    }


}