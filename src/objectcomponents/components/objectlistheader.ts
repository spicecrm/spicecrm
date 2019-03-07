/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'object-list-header',
    templateUrl: './src/objectcomponents/templates/objectlistheader.html',
    providers: [view]
})
export class ObjectListHeader implements OnInit {
    @Input() listfields: Array<any> = [];
    @Input() actionset: string = '';
    module: string = '';

    constructor(private modellist: modellist, private language: language, private view: view) {
        this.module = this.modellist.module;
        this.view.labels = 'short';
    }

    ngOnInit() {
    }

    isSortable(field): boolean {
        if (field.fieldconfig.sortable === true)
            return true;
        else
            return false;
    }

    setSortField(field): void {
        if (this.isSortable(field))
            this.modellist.setSortField(field.field);
    }

    getSortIcon(): string {
        if (this.modellist.sortdirection === 'ASC')
            return 'arrowdown';
        else
            return 'arrowup';
    }

}