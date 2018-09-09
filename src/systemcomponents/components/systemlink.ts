import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'system-link',
    templateUrl: './src/systemcomponents/templates/systemlink.html'
})
export class SystemLink {

    @Output() click: EventEmitter<any> = new EventEmitter<any>();

    constructor() {

    }

    clicked(event){
        this.click.emit(event);
    }


}