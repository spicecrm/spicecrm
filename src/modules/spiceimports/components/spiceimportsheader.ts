/**
 * @module ModuleSpiceImports
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';

import {spiceimportsservice} from '../services/spiceimports.service';

@Component({
    selector: 'spice-imports-header',
    templateUrl: '../templates/spiceimportsheader.html'
})

export class SpiceImportsHeader {

    public filterstatusoptions: {value,label} [] = [
        {value: 'c', label: 'LBL_IMPORTED'},
        {value: 'q', label: 'LBL_SCHEDULED'},
        {value: 'e', label: 'LBL_ERROR'}
    ];

    constructor(public spiceimportsservice: spiceimportsservice) {
    }


}
