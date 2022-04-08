/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-tooltip',
    templateUrl: '../templates/systemtooltip.html'
})
export class SystemTooltip {
    @Input() public tooltiptext: string = '';
    public displayHelp: boolean = false;

    public toggleHelp() {
        this.displayHelp = !this.displayHelp;
    }

    public openHelp() {
        this.displayHelp = true;
    }

    public closeHelp() {
        this.displayHelp = false;
    }
}
