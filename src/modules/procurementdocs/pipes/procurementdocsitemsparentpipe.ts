/**
 * @module ModuleProcurementDocs
 */
import {Pipe, PipeTransform} from '@angular/core';

// pipe to filter the item itself and others that have a parent item already set
@Pipe({
    name: 'procurementdocsitemsparentpipe',
    pure: false
})
export class ProcurementDocsItemsParentPipe implements PipeTransform {
    public transform(items, item) {
        let retValues = [];
        for (let thisItem of items) {
            if (!thisItem.parentitem_id && thisItem.id != item.id) {
                retValues.push(thisItem);
            }
        }
        return retValues;
    }
}
