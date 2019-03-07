/**
 * @module ModuleSpiceImports
 */
import {Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';

import {spiceimportsservice} from '../services/spiceimports.service';

@Component({
    selector: 'spice-imports-list-item',
    templateUrl: './src/modules/spiceimports/templates/spiceimportslistitem.html',
})
export class SpiceImportsListItem {

    @Input() private item = undefined;

    constructor(private language: language,
                private spiceimportsservice: spiceimportsservice) {
    }
}