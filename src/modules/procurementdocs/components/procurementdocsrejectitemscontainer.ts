/**
 * @module ModuleProcurementDocs
 */
import {Component} from '@angular/core';

import {ProcurementDocsItemsContainer} from "./procurementdocsitemscontainer";

@Component({
    selector: 'procurement-docs-reject-items-container',
    templateUrl: '../templates/procurementdocsrejectitemscontainer.html'
})
export class ProcurementDocsRejectItemsContainer extends ProcurementDocsItemsContainer {

}
