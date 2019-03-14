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

    private over: number[];

    constructor( public language: language, public metadata: metadata, public relatedmodels: relatedmodels, public model: model, public layout: layout, private backend: backend, private broadcast: broadcast ) {
        super(language, metadata, relatedmodels, model, layout);
        this.relatedmodels.items$.subscribe( () => this.setOver() );
    }

    get displayfields() {
        return this.listfields;
    }

    public setOver() {
        this.over = [];
        if ( this.relatedmodels.items ) this.relatedmodels.items.forEach( () => this.over.push(0) );
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

        // send to the backen saving the models
        /*
        this.backend.postRequest('/module/'+this.relatedmodels.relatedModule, {}, updateArray).subscribe(updated => {
            for ( let modeldata of updated ) {
                this.broadcast.broadcastMessage('model.save', {
                    id: modeldata.id,
                    module: this.relatedmodels.relatedModule,
                    data: modeldata.data
                });
            }
        });*/
        this.backend.postRequest('/module/'+this.relatedmodels.relatedModule, {}, updateArray);
    }

    /*
    private drop_back( event, targetitem ) {

        event.preventDefault();
        let sourceID = event.dataTransfer.getData('text/plain');

        // build an internal array with ids and sequence
        let itemsArray = [];
        for ( let item of this.relatedmodels.items ) {
            itemsArray.push({id: item.id, sequence: parseInt( item[this.sequencefield], 10 )});
        }

        // sort the Array
        itemsArray.sort((a, b) => {
            return a.sequence > b.sequence ? 1 : -1;
        });

        // get the indexes of the two records
        let sourceitem = {};
        itemsArray.some((item, index) => {
            if ( item.id == sourceID ) {
                sourceitem = itemsArray.splice(index, 1);
                return true;
            }
        });

        // get the current source element
        itemsArray.some((item, index) => {
            if ( item.id == targetitem.id ) {
                itemsArray.splice(index, 0, sourceitem[0]);
                return true;
            }
        });

        // get the droptarget and
        let currentIndex = 0; let indexObj = {}; let updateArray = [];
        for ( let item of itemsArray ) {
            indexObj[item.id] = currentIndex;
            updateArray.push({id: item.id, sequence_number: currentIndex});
            currentIndex++;
        }

        // transverse array to object
        for ( let item of this.relatedmodels.items ) {
            item[this.sequencefield] = indexObj[item.id];
        }

        // resort the array
        this.relatedmodels.items.sort((a, b) => {
            return parseInt( a[this.sequencefield], 10 ) > parseInt( b[this.sequencefield], 10 ) ? 1 : -1;
        });

        // send to the backen saving the models
        this.backend.postRequest('/module/'+this.relatedmodels.relatedModule, {}, updateArray).subscribe(updated => {
            for ( let modeldata of updated ) {
                this.broadcast.broadcastMessage('model.save', {
                    id: modeldata.id,
                    module: this.relatedmodels.relatedModule,
                    data: modeldata.data
                });
            }
        });
    }
    */
}
