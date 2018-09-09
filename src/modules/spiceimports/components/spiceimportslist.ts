import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';

import {spiceimportsservice} from '../services/spiceimports.service';

@Component({
    selector: 'spice-imports-list',
    templateUrl: './app/modules/spiceimports/templates/spiceimportslist.html'
})
export class SpiceImportsList {

    @ViewChild('listcontainer', {read: ViewContainerRef}) listcontainer: ViewContainerRef;

    constructor(private language: language,
                private spiceimportsservice: spiceimportsservice) {
    }

    listStyle() {
        let rect = this.listcontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(100vh - ' + rect.top + 'px)'
        }
    }

    get items(){
        return this.spiceimportsservice.items;
    }

    onScroll(e) {

        let element = this.listcontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.spiceimportsservice.loadMoreData();
        }
    }

}