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

    public filtermodule: string = '';
    public filterstatus: string = '';
    public filterstatusoptions: {value,label} [] = [];

    constructor(public language: language,
                public spiceimportsservice: spiceimportsservice) {

        // set filter options
        this.filterstatusoptions.push(
            {value: 'c', label: 'LBL_IMPORTED'},
            {value: 'q', label: 'LBL_SCHEDULED'},
            {value: 'e', label: 'LBL_ERROR'}
        );
    }

    public listStyle() {
        let rect = this.listcontainer.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px)'
        };
    }

    get items(){

        if(this.filtermodule && this.filterstatus) {
            return this.spiceimportsservice.items.filter(item => {
                return (item.module === this.filtermodule && item.status === this.filterstatus);
            });
        } else if(this.filtermodule) {
            return this.spiceimportsservice.items.filter(item => {
                return (item.module === this.filtermodule);
            });
        } else if(this.filterstatus) {
            return this.spiceimportsservice.items.filter(item => {
                return (item.status === this.filterstatus);
            });
        }

        return this.spiceimportsservice.items;
    }

    public onScroll(e) {

        let element = this.listcontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.spiceimportsservice.loadMoreData();
        }
    }

}
