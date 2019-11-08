/**
 * @module ObjectComponents
 */
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {language} from '../../services/language.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'object-status-network-button-item',
    templateUrl: './src/objectcomponents/templates/objectstatusnetworkbuttonitem.html',
    host: {
        '(click)': 'this.setStatus()'
    }
})
export class ObjectStatusNetworkButtonItem implements OnInit {

    @Input() private item: any = {};
    @Output() private status: EventEmitter<string> = new EventEmitter<string>();

    constructor(private language: language) {

    }

    public ngOnInit(): void {
        console.log(this.item);
    }

    private setStatus() {
        this.status.emit(this.item.status_to);
    }
}
