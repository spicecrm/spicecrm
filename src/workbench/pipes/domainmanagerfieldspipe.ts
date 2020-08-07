/**
 * @module ModuleWorkbench
 */
import {Pipe, PipeTransform} from '@angular/core';

/**
 * a pipe thast returns the fields for a domain
 */
@Pipe({
    name: 'domainmanagerfieldspipe',
    pure: false
})
export class DomainManagerFieldsPipe implements PipeTransform {

    public transform(values, domaindefinitionid) {
        let retvalues = [];

        return values.filter(field => field.sysdomaindefinition_id == domaindefinitionid);
    }
}
