/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {ObjectRelatedlistList} from './objectrelatedlistlist';

@Component({
    selector: 'object-relatedlist-list',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistsequenced.html',
    providers: [relatedmodels]
})
export class ObjectRelatedlistSequenced extends ObjectRelatedlistList {

    sequencefield: string = '';

    ngOnInit(){
        super.ngOnInit();

        this.sequencefield = this.componentconfig.sequencefield;
    }
}