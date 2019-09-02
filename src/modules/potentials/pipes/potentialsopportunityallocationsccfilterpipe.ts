/**
 * @module ModulePotentials
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'potentialsopportunityallocationsccfilter',
    pure: false
})
export class PotentialsOpportunityAllocationsCCFilterPipe implements PipeTransform {

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
