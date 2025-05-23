/**
 * @module WorkbenchModule
 */
import {Component} from '@angular/core';

@Component({
    templateUrl: '../templates/modulefilterbuilder.html',
    standalone: false
})
export class ModuleFilterBuilder {
    public filter: any;
}
