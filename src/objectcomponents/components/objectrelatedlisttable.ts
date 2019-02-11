import {Component, AfterViewInit, OnInit, OnDestroy, Input, ChangeDetectionStrategy} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';

@Component({
    selector: 'object-relatedlist-table',
    templateUrl: './src/objectcomponents/templates/objectrelatedlisttable.html'
})
export class ObjectRelatedlistTable {

    @Input() public listfields: any[] = [];
    @Input() private module: any[] = [];
    @Input() private editable: boolean = false;
    @Input() private editcomponentset: boolean = false;

    constructor(public language: language, public metadata: metadata, public relatedmodels: relatedmodels, public model: model, public layout: layout) {

    }

    get isloading() {
        return this.relatedmodels.isloading;
    }

    get isSmall(){
        return this.layout.screenwidth == 'small';
    }

    private isSortable(field): boolean {
        if (field.fieldconfig.sortable === true) {
            return true;
        } else {
            return false;
        }
    }

    private setSortField(field): void {
        if (this.isSortable(field)) {
            this.relatedmodels.sortfield = field.fieldconfig && field.fieldconfig.sortfield ? field.fieldconfig.sortfield : field.field;
        }
    }

    private getSortIcon(field): string {
        if (this.relatedmodels.sortfield == (field.fieldconfig && field.fieldconfig.sortfield ? field.fieldconfig.sortfield : field.field)) {
            if (this.relatedmodels.sort.sortdirection === 'ASC') {
                return 'arrowdown';
            } else {
                return 'arrowup';
            }
        }
    }
}
