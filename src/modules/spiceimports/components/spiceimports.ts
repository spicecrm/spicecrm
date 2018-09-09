import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';

import {spiceimportsservice} from '../services/spiceimports.service';

@Component({

    templateUrl: './src/modules/spiceimports/templates/spiceimports.html',
    providers: [
        spiceimportsservice
    ]
})

export class SpiceImports implements OnInit {

    constructor(private language: language,
                private spiceimportsservice: spiceimportsservice) {
    }

    ngOnInit() {
        this.spiceimportsservice.loadData();
    }
}