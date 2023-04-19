/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {layout} from "../../services/layout.service";

/**
 * renders the header row for the list view
 */
@Component({
    selector: 'object-listview-header-details',
    templateUrl: '../templates/objectlistviewheaderdetails.html'
})
export class ObjectListViewHeaderDetails {
    constructor(public modellist: modellist, public language: language, public layout: layout) {

    }
}
