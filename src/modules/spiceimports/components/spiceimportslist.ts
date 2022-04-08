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

    @ViewChild('listcontainer', {read: ViewContainerRef, static: true}) public listcontainer: ViewContainerRef;

    constructor(public language: language,
                public spiceimportsservice: spiceimportsservice) {
    }

    public listStyle() {
        let rect = this.listcontainer.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px)'
        };
    }

    get items(){
        return this.spiceimportsservice.items;
    }

    public onScroll(e) {

        let element = this.listcontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.spiceimportsservice.loadMoreData();
        }
    }

}
