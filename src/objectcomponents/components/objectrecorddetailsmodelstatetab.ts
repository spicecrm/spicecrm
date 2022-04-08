/**
 * @module ObjectComponents
 */

import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

import {ObjectRecordDetailsTab} from "./objectrecorddetailstab";

/**
 * renders a tab item with a fieldset as part of the details view on a model. The tab is hidden by default and animates in when the model state is set accordingly
 *
 * in any case requires a component that provides a view and a model
 */
@Component({
    selector: 'object-record-details-modelstate-tab',
    templateUrl: '../templates/objectrecorddetailsmodelstatetab.html',
    animations: [
        trigger('displayanimation', [
            transition(':enter', [
                style({ opacity: 0 , height: '0px',overflow: 'hidden'}),
                animate('.5s', style({ height: '*', opacity: 1 })),
                style({ overflow: 'unset'})
            ]),
            transition(':leave', [
                style({ overflow: 'hidden'}),
                animate('.5s', style({ height: '0px', opacity: 0 }))
            ])
        ])
    ]
})
export class ObjectRecordDetailsModelstateTab extends ObjectRecordDetailsTab{


}
