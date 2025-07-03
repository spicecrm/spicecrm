/**
 * @module WorkbenchModule
 */
import { Component, Input } from '@angular/core';

@Component({
    templateUrl: '../templates/apilogreplayitemxml.html',
    selector: "[apilog-replay-item-xml]",
    standalone: false
})
export class APIlogReplayItemXML {

    @Input() public item: any;
    @Input() public editMode = false;
    @Input() public isLast = false;

    constructor() {}

    ngOnInit() {
        if ( this.item.childs && this.item.childs.length === 1 && this.item.childs[0].isTextNode ) this.item = this.item.childs[0];
    }

}
