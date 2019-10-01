/**
 * @module ModuleACLTerritories
 */
import {Pipe, PipeTransform} from '@angular/core';

/**
 * a pipe that filters territory by name
 */
@Pipe({
    name: 'aclterritoriesnamepipe',
    pure: false
})
export class ACLTerritoriesNamePipe implements PipeTransform {
    public transform(values, filterterm) {
        let retvalues = [];
        if (values) {
            for (let value of values) {
                if (!filterterm || value.name.toLowerCase().indexOf(filterterm.toLowerCase()) != -1) {
                    retvalues.push(value);
                }
            }
        }
        return retvalues;
    }
}