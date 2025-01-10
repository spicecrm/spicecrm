/**
 * @module WorkbenchModule
 */
import {Pipe} from '@angular/core';

@Pipe({
    name: 'salesdocsitemsdeletedpipe',
    pure: false
})
export class SalesDocsItemsDeletedPipe {
    public transform(values) {

        // sort by itemnumber
        values.sort((a, b) => {
            return parseInt(a.itemnr, 10) - parseInt(b.itemnr, 10);
        });

        let retValues = [];
        for (let value of values.filter(v => !v.parentitem_id)) {
            if (value.deleted != 1) {
                retValues.push(value);
            }
        }

        for (let value of values.filter(v => !!v.parentitem_id)) {
            if (value.deleted != 1) {
                let index = retValues.findIndex(r => r.id == value.parentitem_id);
                retValues.splice(index + 1, 0, value);
            }
        }

        return retValues;
    }
}
