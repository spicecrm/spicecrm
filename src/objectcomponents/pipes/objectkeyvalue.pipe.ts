/**
 * @module ObjectComponents
 */
import {Pipe, PipeTransform} from "@angular/core";

/**
 * transforms an object with an attribute and a value into an aray with objects with attributes key and value
 */
@Pipe({name: 'objectkeyvalues'})
export class ObjectKeyValuesPipe implements PipeTransform {
    public transform(value): any {
        let keys = [];
        for (let key in value) {
            keys.push({key: key, value: value[key]});
        }
        return keys;
    }
}
