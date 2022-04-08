/**
 * @module SystemComponents
 */
import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'system-link',
    templateUrl: '../templates/systemlink.html'
})
export class SystemLink {

    @Output() public click: EventEmitter<any> = new EventEmitter<any>();

    public clicked(event) {
        this.click.emit(event);
    }


}
