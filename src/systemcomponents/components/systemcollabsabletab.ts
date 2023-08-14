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

/**
 * renders a tab panel that can be collpsed (if enabled)
 */
@Component({
    selector: 'system-collapsable-tab',
    templateUrl: '../templates/systemcollapsabletab.html',
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

    /**
     * if set to false the panel will not be collapsible
     */
    @Input() public collapsible: boolean = true;

    /**
     * set to true to expand it when loaded. if set to false the panel will be collapsed by default
     */
    @Input() public expanded: boolean = true;

    /**
     * an ipnput to control the margin
     */
    @Input() public margin: 'default'|'none' = "default";

    /**
     * @deprecated: replaced by tabtitle since title is reserved and will render a title for the dom element
     */
    @Input() public title: string = '';

    /**
     * an optional icon to be rendered on the tab as module icon
     */
    @Input() public moduleicon: string = '';


    /**
     * the title. This can be a string or a label that will be run via the laguage service to be rendered in the users language
     */
    @Input() public tabtitle: string = '';

    /**
     * a help text for the title.
     */
    @Input() public tabhelptext: string = '';

    constructor(public language: language) {
    }

    /**
     * colapses and expands the panel
     */
    public togglePanel() {
        this.expanded = !this.expanded;
    }

    /**
     * a getter for the title
     *
     * @private
     */
    get _title() {
        return this.tabtitle ? this.tabtitle : this.title ? this.title : false;
    }

    get _helpText() {
        return this.tabhelptext ? this.language.getLabel(this.tabhelptext) : false;
    }
}
