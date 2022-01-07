/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-card-header',
    templateUrl: '../templates/systemcardheader.html',
})
export class SystemCardHeader {
    @Input() public icon: string;
    @Input() public module: string;
    @Input() public cardtitel: string;
}
