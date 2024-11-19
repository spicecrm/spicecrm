/**
 * @module ModuleSpiceImports
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';

import {spiceimportsservice} from '../services/spiceimports.service';

@Component({
    selector: 'spice-imports-list',
    templateUrl: '../templates/spiceimportslist.html'
})
export class SpiceImportsList {


    constructor(public language: language,
                public spiceimportsservice: spiceimportsservice) {


    }


    public loadMore(){
        this.spiceimportsservice.loadMoreData();
    }

}
