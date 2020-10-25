/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, Input
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {dictionarymanager} from '../services/dictionarymanager.service';

/**
 * renders the details form for the dircitonary item
 */
@Component({
    selector: 'dictionary-manager-item-details',
    templateUrl: './src/workbench/templates/dictionarymanageritemdetails.html',
})
export class DictionaryManagerItemDetails {

    @Input() private dictionaryitem: any;

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language) {

    }


}
