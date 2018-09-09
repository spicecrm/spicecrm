import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-tooltip',
    templateUrl: './src/systemcomponents/templates/systemtooltip.html'
})
export class SystemTooltip {
    @Input() tooltiptext: string = '';
    displayHelp: boolean = false;

    toggleHelp(){
        this.displayHelp = !this.displayHelp;
    }

    openHelp(){
        this.displayHelp = true;
    }

    closeHelp(){
        this.displayHelp = false;
    }
}