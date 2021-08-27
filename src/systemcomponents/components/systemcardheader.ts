/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-card-header',
    templateUrl: './src/systemcomponents/templates/systemcardheader.html',
})
export class SystemCardHeader {
    @Input() private icon: string;
    @Input() private module: string;
    @Input() private cardtitel: string;
}
