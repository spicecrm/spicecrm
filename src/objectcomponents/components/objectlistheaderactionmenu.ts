/**
 * @module ObjectComponents
 */
import {Component, Input} from '@angular/core';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';

@Component({
    selector: 'object-list-header-actionmenu',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionmenu.html'
})
export class ObjectListHeaderActionMenu {

    @Input() private actionset: string = '';

    constructor(private modellist: modellist, private language: language) {
    }

    get selectAll() {
        return this.modellist.listSelected.type === 'all';
    }

    private setAllSelected() {
        // this.menuOpen = false;
        this.modellist.setAllSelected();
    }

    private setAllUnselected() {
        // this.menuOpen = false;
        this.modellist.setAllUnselected();
    }

    get hasSelection() {
        return this.modellist.getSelectedCount() > 0;
    }

}