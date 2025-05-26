/**
 * @module ModuleProcurementDocs
 */
import {Component} from '@angular/core';

import {ProcurementDocsItemsContainer} from "./procurementdocsitemscontainer";

@Component({
    selector: 'procurement-docs-reject-items-container',
    templateUrl: '../templates/procurementdocsrejectitemscontainer.html',
    standalone: false
})
export class ProcurementDocsRejectItemsContainer extends ProcurementDocsItemsContainer {

}
