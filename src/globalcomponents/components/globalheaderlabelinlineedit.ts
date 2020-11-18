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
    templateUrl: './src/globalcomponents/templates/globalheaderlabelinlineedit.html'
})
export class GlobalHeaderLabelInlineEdit {

    constructor(private language: language,
                private session: session) {
    }

    /**
     * toogle inline edit enabled
     * @private
     */
    private toggleEnabled() {
        this.language.inlineEditEnabled = !this.language.inlineEditEnabled;
        this.language.currentlanguage$.emit(this.language.currentlanguage);
    }
}
