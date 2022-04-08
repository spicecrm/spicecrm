/**
 * @module WorkbenchModule
 */
import {
    Component, Input
} from '@angular/core';

import {dictionarymanager} from '../services/dictionarymanager.service';
import {Relationship} from "../interfaces/dictionarymanager.interfaces";

@Component({
    selector: 'dictionary-manager-relationships-details',
    templateUrl: '../templates/dictionarymanagerrelationshipsdetails.html',
})
export class DictionaryManagerRelationshipsDetails {

    @Input() public dictionaryRelationship: Relationship;

    constructor(public dictionarymanager: dictionarymanager) {

    }


}
