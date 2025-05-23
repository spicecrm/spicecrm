/**
 * @module ModuleSpiceImports
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';

import {spiceimportsservice} from '../services/spiceimports.service';

@Component({
    selector: 'spice-imports',
    templateUrl: '../templates/spiceimports.html',
    providers: [
        spiceimportsservice
    ],
    standalone: false
})

export class SpiceImports implements OnInit {

    constructor(public language: language,
                public spiceimportsservice: spiceimportsservice) {
    }

    ngOnInit() {
        this.spiceimportsservice.loadData();
    }
}
