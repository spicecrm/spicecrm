/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component} from '@angular/core';
import {language} from '../../services/language.service';
import {session} from "../../services/session.service";

/**
 * displays a button to toggle label inline editing
 */
@Component({
    selector: 'global-header-label-inline-edit',
    templateUrl: '../templates/globalheaderlabelinlineedit.html'
})
export class GlobalHeaderLabelInlineEdit {

    constructor(public language: language,
               public session: session) {
    }

    /**
     * toogle inline edit enabled
     * @private
     */
   public toggleEnabled() {
        this.language.inlineEditEnabled = !this.language.inlineEditEnabled;
        this.language.currentlanguage$.emit(this.language.currentlanguage);
    }
}
