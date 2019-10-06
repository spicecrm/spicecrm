/**
 * @module ModuleACLTerritories
 */
import {  Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'fieldterritorysecondarypipe',
    pure: false
})
export class fieldTerritorySecondaryPipe implements PipeTransform {

    public transform(territories, primary_territory_id) {
        let retValues = [];

        for (let territory of territories) {
            if (territory.id != primary_territory_id) {
                retValues.push(territory);
            }
        }

        return retValues;
    }
}

