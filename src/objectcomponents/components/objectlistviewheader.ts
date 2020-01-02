/**
 * @module ObjectComponents
 */
import {Component, Input} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {animate, style, transition, trigger} from "@angular/animations";

/**
 * renders the default header for a listview of a module
 */
@Component({
    selector: 'object-listview-header',
    templateUrl: './src/objectcomponents/templates/objectlistviewheader.html',
    animations: [
        trigger('animatepanel', [
            transition(':enter', [
                style({right: '-320px', overflow: 'hidden'}),
                animate('.5s', style({right: '0px'})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({right: '-320px'}))
            ])
        ])
    ]
})
export class ObjectListViewHeader {
    /**
     * the actionset to be rendered
     */
    private actionSet: any = {};

    /**
     * the search timeout triggered by the keyup in the search box
     */
    private searchTimeOut: any;

    constructor(private metadata: metadata, private modellist: modellist, private language: language, private model: model) {
        let componentconfig = this.metadata.getComponentConfig('ObjectListViewHeader', this.model.module);
        this.actionSet = componentconfig.actionset;
    }

    /**
     * the trigger for the keyup on the search field
     *
     * @param e the event
     */
    private onKeyUp(e) {
        // handle the key pressed
        switch (e.key) {
            case 'Enter':
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.modellist.reLoadList();
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.modellist.reLoadList(), 1000);
                break;
        }
    }
}
