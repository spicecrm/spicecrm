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
            state('open', style({ height: '*', opacity: 1})),
            state('closed', style({ height: '0px', opacity: 0 })),
            transition('open => closed', [
                style({ overflow: 'hidden'}),
                animate('.5s')
            ]),
            transition('closed => open', [
                animate('.5s'),
                style({ overflow: 'unset'})
            ])
        ])
    ]
})
export class SystemCollabsableTab {

    @Input() private expanded: boolean = true;
    @Input() private title: string = '';

    constructor(private language: language){}

    private togglePanel(){
        this.expanded = !this.expanded;
    }
}
