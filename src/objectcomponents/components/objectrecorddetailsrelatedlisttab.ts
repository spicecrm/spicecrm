/**
 * @module ObjectComponents
 */

import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

/**
 * renders a tab that holds a table with related items
 *
 * in any case requires a component that provides a view and a model
 */
@Component({
    selector: 'object-record-details-related-list-tab',
    templateUrl: '../templates/objectrecorddetailsrelatedlisttab.html'
})
export class ObjectRecordDetailsRelatedListTab {

    /**
     * @ignore
     */
    public componentconfig: any = {};

    constructor( public language: language) {
    }

}
