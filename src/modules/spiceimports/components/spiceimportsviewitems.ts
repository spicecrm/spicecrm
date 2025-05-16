/**
 * @module ModuleActivities
 */
import {Component, ViewChild, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'spice-imports-view-items',
    templateUrl: '../templates/spiceimportsviewitems.html',
})
export class SpiceImportsViewItems {
    public readonly disableForMobileView = true;

    constructor(public language: language, public modellist: modellist) {

    }

    /**
     * handle the screoll event when emitted from the tobottom directive
     */
    public handleScroll() {
        this.modellist.loadMoreList();
    }
}
