import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-split-container-left',
    template: '<ng-content></ng-content>',
    host: {
        '[class.slds-hide]': 'hidden',
        '[style]': 'expanded ? "width: 100%" : null'
    }
})

export class SystemSplitContainerLeft {
    public hidden = false;
    public expanded = false;
    @Input() public containerClass: string;
}