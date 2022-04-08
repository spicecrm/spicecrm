/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {metadata} from '../../services/metadata.service';
import {animate, style, transition, trigger} from "@angular/animations";

/**
 * provides an aggregate panel to be displayed as part of the lookup modal
 */
@Component({
    selector: 'object-modal-module-lookup-aggregates',
    templateUrl: '../templates/objectmodalmodulelookupaggregates.html',
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
export class ObjectModalModuleLookupAggregates {

    constructor(public modellist: modellist, public metadata: metadata) {

    }

    /**
     * returns true if the aggregtaes have a tag element
     */
    get hasTags(): boolean {
        return this.metadata.checkTagging(this.modellist.module);
    }

    /**
     * a getter for the aggregates
     */
    public getAggregates() {
        return this.modellist.moduleAggregates;
    }
}
