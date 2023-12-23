import {Component, ContentChild, ContentChildren, EventEmitter, OnInit, Output, QueryList} from '@angular/core';
import {SystemSplitContainerLeft} from "./systemsplitcontainerleft";
import {SystemSplitContainerRight} from "./systemsplitcontainerright";

@Component({
    selector: 'system-split-container',
    templateUrl: '../templates/systemsplitcontainer.html',
    host: {
        class: 'slds-size--1-of-1 slds-height_full slds-grid',
        style: 'padding-right: 13px;'
    }
})

export class SystemSplitContainer {
    @Output() private onExpand: EventEmitter<'left' | 'right'> = new EventEmitter<'left' | 'right'>();
    @ContentChild(SystemSplitContainerLeft) public childLeft: SystemSplitContainerLeft;
    @ContentChild(SystemSplitContainerRight) public childRight: SystemSplitContainerRight;

    /**
     * set expanded side
     * @param side
     */
    public expand(side: 'left' | 'right') {

        if (side == 'left' && !this.childRight.expanded) {
            this.childRight.hidden = true;
            this.childRight.expanded = false;
            this.childLeft.hidden = false;
            this.childLeft.expanded = true;
        } else if (side == 'right' && !this.childLeft.expanded) {
            this.childLeft.hidden = true;
            this.childLeft.expanded = false;
            this.childRight.expanded = true;
            this.childRight.hidden = false;
        } else {
            this.childLeft.hidden = false;
            this.childLeft.expanded = false;
            this.childRight.hidden = false;
            this.childRight.expanded = false;
        }

        this.onExpand.emit(side);
    }
}