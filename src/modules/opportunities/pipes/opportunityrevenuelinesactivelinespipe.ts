/**
 * @module WorkbenchModule
 */
import {Pipe} from '@angular/core';

@Pipe({
    name: 'opportunityrevenuelinesactivelinespipe',
    pure: false
})
export class OpportunityRevenueLinesActiveLinesPipe {
    public transform(values) {
        let retValues = [];
        for (let value of values) {
            if (value.deleted != true) {
                retValues.push(value);
            }
        }
        return retValues;
    }
}
