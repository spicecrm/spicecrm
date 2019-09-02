/**
 * @module ModulePotentials
 */
import {Pipe} from '@angular/core';

@Pipe({
    name: 'potentialsopportunityallocationsccfilterpipe',
    pure: false
})
export class PotentialsOpportunityAllocationsCCFilterPipe {

    public transform(values, companycode) {
        let retValues = [];
        for (let value of values) {
            if (value.companycode_id == companycode) {
                retValues.push(value);
            }
        }
        return retValues;
    }
}
