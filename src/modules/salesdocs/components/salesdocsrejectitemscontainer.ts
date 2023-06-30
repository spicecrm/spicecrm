/**
 * @module ModuleSalesDocs
 */
import {
    Component
} from '@angular/core';

import {SalesDocsItemsContainer} from "./salesdocsitemscontainer";
import {salesdocrecord} from "../services/salesdocrecord";

@Component({
    selector: 'salesdocs-reject-items-container',
    templateUrl: '../templates/salesdocsrejectitemscontainer.html',
    providers:[salesdocrecord]
})
export class SalesDocsRejectItemsContainer extends SalesDocsItemsContainer {

}
