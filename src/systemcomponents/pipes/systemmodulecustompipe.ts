/**
 * @module WorkbenchModule
 */
import {Pipe} from '@angular/core';

@Pipe({
    name: 'systemmodulecustompipe',
    pure: false
})
export class SystemModuleCustomPipe {
    public transform(values, module) {
        let retValues = [];
        for (let value of values) {
            if (value.module == module && value.type == "custom") {
                retValues.push(value);
            }
        }
        return retValues;
    }
}
