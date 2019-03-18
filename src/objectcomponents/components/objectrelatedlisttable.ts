/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import { backend } from '../../services/backend.service';

@Component({
    selector: 'object-relatedlist-table',
    templateUrl: './src/objectcomponents/templates/objectrelatedlisttable.html'
})
export class ObjectRelatedlistTable implements OnInit {

    @Input() public listfields: any[] = [];
    @Input() private module: any[] = [];
    @Input() private editable: boolean = false;
    @Input() private editcomponentset: boolean = false;
    @Input() private sequencefield: string = null;

    public nowDragging = false;
    public isSequenced = false;

    constructor(public language: language, public metadata: metadata, public relatedmodels: relatedmodels, public model: model, public layout: layout, public backend: backend) { }

    public ngOnInit() {
        if ( !this.sequencefield && this.model.fields[this.relatedmodels._linkName].sequence_field ) {
            this.sequencefield = this.model.fields[this.relatedmodels._linkName].sequence_field;
        }
        if ( this.sequencefield ) this.isSequenced = true;
    }

    get isloading() {
        return this.relatedmodels.isloading;
    }

    get isSmall() {
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

    private getIdOfRow( index, item ) {
        return item.id;
    }

    private drop(event) {
        let previousItem = this.relatedmodels.items.splice(event.previousIndex, 1);
        this.relatedmodels.items.splice(event.currentIndex, 0, previousItem[0]);

        let updateArray = [];
        let i = 0;
        for ( let item of this.relatedmodels.items ) {
            item[this.sequencefield] = i;
            updateArray.push({id: item.id, sequence_number: i});
            i++;
        }

        this.backend.postRequest('module/'+this.relatedmodels.relatedModule, {}, updateArray);
    }

    private dragStarted(e) {
        this.nowDragging = true;
        e.source.element.nativeElement.classList.add('slds-is-selected');
    }

    private dragEnded(e) {
        this.nowDragging = false;
        e.source.element.nativeElement.classList.remove('slds-is-selected');
    }

}
