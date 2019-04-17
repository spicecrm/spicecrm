/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-tooltip',
    templateUrl: './src/systemcomponents/templates/systemtooltip.html'
})
export class SystemTooltip {
    @Input() private tooltiptext: string = '';
    private displayHelp: boolean = false;

    private toggleHelp(){
        this.displayHelp = !this.displayHelp;
    }

    private openHelp(){
        this.displayHelp = true;
    }

    private closeHelp(){
        this.displayHelp = false;
    }
}
