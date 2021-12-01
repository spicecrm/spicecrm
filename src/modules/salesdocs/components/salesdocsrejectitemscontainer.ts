/**
 * @module ModuleSalesDocs
 */
import {
    Component,
    ElementRef,
    Injector
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {currency} from '../../../services/currency.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';

import {SalesDocsItemsContainer} from "./salesdocsitemscontainer";

@Component({
    selector: 'salesdocs-reject-items-container',
    templateUrl: '../templates/salesdocsrejectitemscontainer.html'
})
export class SalesDocsRejectItemsContainer extends SalesDocsItemsContainer {

}
