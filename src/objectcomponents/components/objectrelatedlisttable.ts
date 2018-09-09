import {Component, AfterViewInit, OnInit, OnDestroy, Input, ChangeDetectionStrategy} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {Router}   from '@angular/router';

@Component({
    selector: 'object-relatedlist-table',
    templateUrl: './src/objectcomponents/templates/objectrelatedlisttable.html'
})
export class ObjectRelatedlistTable {

    @Input() listfields: Array<any> = [];
    @Input() module: Array<any> = [];
    @Input() editable: boolean = false;
    @Input() editcomponentset: boolean = false;

    constructor(public language: language, public metadata: metadata, public relatedmodels: relatedmodels, public model: model, public router: Router) {

    }

    get isloading(){
        return this.relatedmodels.isloading;
    }


    isSortable(field): boolean {
        if (field.fieldconfig.sortable === true)
            return true;
        else
            return false;
    }

    setSortField(field): void {
        if(this.isSortable(field)) {
            this.relatedmodels.sortfield = field.fieldconfig && field.fieldconfig.sortfield ? field.fieldconfig.sortfield : field.field;
        }
    }

    getSortIcon(field): string {
        if(this.relatedmodels.sortfield == (field.fieldconfig && field.fieldconfig.sortfield ? field.fieldconfig.sortfield : field.field) ) {
            if (this.relatedmodels.sort.sortdirection === 'ASC')
                return 'arrowdown';
            else
                return 'arrowup';
        }
    }

}