/**
 * @module WorkbenchModule
 */
import {Pipe} from '@angular/core';

@Pipe({
    name: 'serviceorderitempipe',
    pure: false
})
export class ServiceOrderItemPipe {
    public transform(values) {
        let retValues = [];
        for (let value of values) {
            if (value.deleted != 1) {
                retValues.push(value);
            }
        }

        // sort by itemnumber
        retValues.sort((a, b) => {
            return parseInt(a.itemnr, 10) - parseInt(b.itemnr, 10);
        });

        return retValues;
    }
}
