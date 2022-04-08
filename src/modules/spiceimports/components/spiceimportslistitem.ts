/**
 * @module ModuleSpiceImports
 */
import {Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';

import {spiceimportsservice} from '../services/spiceimports.service';

@Component({
    selector: 'spice-imports-list-item',
    templateUrl: '../templates/spiceimportslistitem.html',
})
export class SpiceImportsListItem {

    @Input() public item = undefined;

    constructor(public language: language,
                public spiceimportsservice: spiceimportsservice) {
    }
}
