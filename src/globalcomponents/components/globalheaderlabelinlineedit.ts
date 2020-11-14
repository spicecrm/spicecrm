/**
 * @module GlobalComponents
 */
import {Component} from '@angular/core';
import {language} from '../../services/language.service';

/**
 * displays a button to toggle label inline editing
 */
@Component({
    selector: 'global-header-label-inline-edit',
    templateUrl: './src/globalcomponents/templates/globalheaderlabelinlineedit.html'
})
export class GlobalHeaderLabelInlineEdit {

    constructor(private language: language) {
    }
}
