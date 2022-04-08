/**
 * @module ModuleSpiceImports
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';

import {spiceimportsservice} from '../services/spiceimports.service';

@Component({

    templateUrl: '../templates/spiceimports.html',
    providers: [
        spiceimportsservice
    ]
})

export class SpiceImports implements OnInit {

    constructor(public language: language,
                public spiceimportsservice: spiceimportsservice) {
    }

    ngOnInit() {
        this.spiceimportsservice.loadData();
    }
}
