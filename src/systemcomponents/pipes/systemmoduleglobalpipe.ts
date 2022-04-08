/**
 * @module WorkbenchModule
 */
import {Pipe} from '@angular/core';

@Pipe({name: 'systemmoduleglobalpipe'})
export class SystemModuleGlobalPipe {
    public transform(values, module) {
        let retValues = [];
        for (let value of values) {
            if (value.module == module && value.type == "global") {
                retValues.push(value);
            }
        }
        return retValues;
    }
}
