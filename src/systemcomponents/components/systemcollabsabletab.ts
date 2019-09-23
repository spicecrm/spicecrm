/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-collapsable-tab',
    templateUrl: './src/systemcomponents/templates/systemcollapsabletab.html',
    animations: [
        trigger('tabanimation', [
            // open
            state('true', style({height: '*', opacity: 1})),
            // closed
            state('false', style({height: '0px', opacity: 0})),
            // open => close
            transition('true => false', [
                style({overflow: 'hidden'}),
                animate('.5s')
            ]),
            // close => open
            transition('false => true', [
                animate('.5s'),
                style({overflow: 'inherit'})
            ])
        ])
    ]
})
export class SystemCollabsableTab {

    @Input() private expanded: boolean = true;
    @Input() private title: string = '';
    @Input() private moduleicon: string = '';
    @Input() private tabtitle: string = '';

    constructor(private language: language) {
    }

    private togglePanel() {
        this.expanded = !this.expanded;
    }

    get _title() {
        return this.tabtitle ? this.tabtitle : this.title ? this.title : false;
    }
}
