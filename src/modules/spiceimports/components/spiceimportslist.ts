/**
 * @module ModuleSpiceImports
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';

import {spiceimportsservice} from '../services/spiceimports.service';

@Component({
    selector: 'spice-imports-list',
    templateUrl: './src/modules/spiceimports/templates/spiceimportslist.html'
})
export class SpiceImportsList {

    @ViewChild('listcontainer', {read: ViewContainerRef}) private listcontainer: ViewContainerRef;

    constructor(private language: language,
                private spiceimportsservice: spiceimportsservice) {
    }

    private listStyle() {
        let rect = this.listcontainer.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px)'
        };
    }

    get items(){
        return this.spiceimportsservice.items;
    }

    private onScroll(e) {

        let element = this.listcontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.spiceimportsservice.loadMoreData();
        }
    }

}
