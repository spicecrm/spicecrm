import {Component, Input} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-collapsable-tab',
    templateUrl: './src/systemcomponents/templates/systemcollapsabletab.html'
})
export class SystemCollabsableTab {

    @Input() expanded: boolean = true;
    @Input() title: string = '';

    constructor(private language: language){}

    togglePanel(){
        this.expanded = !this.expanded;
    }

    getChevronStyle(){
        if(!this.expanded)
            return{
                'transform': 'rotate(45deg)',
                'margin-top' : '4px'
            }
    }

    getTabStyle(){
        if(!this.expanded)
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            }
    }

}