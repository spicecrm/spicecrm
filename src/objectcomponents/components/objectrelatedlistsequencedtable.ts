/**
 * @module ObjectComponents
 */
import { Component, Input } from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from "../../services/layout.service";
import {ObjectRelatedlistTable} from './objectrelatedlisttable';

@Component({
    selector: 'object-relatedlist-sequenced-table',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistsequencedtable.html'
})
export class ObjectRelatedlistSequencedTable extends ObjectRelatedlistTable {

    @Input() private sequencefield: string = 'sequence_number';

    private nowDragging = false;

    constructor( public language: language, public metadata: metadata, public relatedmodels: relatedmodels, public model: model, public layout: layout, private backend: backend, private broadcast: broadcast ) {
        super(language, metadata, relatedmodels, model, layout);
    }

    get displayfields() {
        return this.listfields;
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
