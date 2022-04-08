/**
 * @module ObjectComponents
 */
import {Pipe, PipeTransform} from "@angular/core";
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';

/**
 * transforms an object with an attribute and a value into an aray with objects with attributes key and value
 */
@Pipe({
    name: 'objectfieldfilter',
    pure: false
})
export class ObjectFieldFilterPipe implements PipeTransform {

    constructor(public languange: language, public model: model) {

    }

    public transform(fields, filter): any {
        let retfields = [];
        for (let field of fields) {
            if (field.toLowerCase().indexOf(filter.toLowerCase()) >= 0 || this.languange.getFieldDisplayName(this.model.module, field).toLowerCase().indexOf(filter.toLowerCase()) > 0) {
                retfields.push(field);
            }
        }
        return retfields;
    }
}
