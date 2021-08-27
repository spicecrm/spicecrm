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
    templateUrl: './src/workbench/templates/dictionarymanagerrelationshipsdetails.html',
})
export class DictionaryManagerRelationshipsDetails {

    @Input() private dictionaryRelationship: Relationship;

    constructor(private dictionarymanager: dictionarymanager) {

    }


}
