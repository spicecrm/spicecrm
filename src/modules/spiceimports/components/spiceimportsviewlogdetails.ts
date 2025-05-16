/**
 * @module ModuleSpiceImports
 */
import {Component, Input, OnInit,} from '@angular/core';

@Component({
    selector: 'spice-imports-view-log-details',
    templateUrl: '../templates/spiceimportsviewlogdetails.html',
})
export class SpiceImportsViewLogDetails implements OnInit{

    @Input() public data: string;
    @Input() public header: string[];

    public logFields = [];

    public ngOnInit() {
        this.logFields = this.data.split('";"');
    }

}
