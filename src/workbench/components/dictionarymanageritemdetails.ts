/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, Input
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryItem} from "../interfaces/dictionarymanager.interfaces";

/**
 * renders the details form for the dircitonary item
 */
@Component({
    selector: 'dictionary-manager-item-details',
    templateUrl: '../templates/dictionarymanageritemdetails.html',
})
export class DictionaryManagerItemDetails {

    @Input() public dictionaryitem: DictionaryItem;

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public language: language) {

    }


}
