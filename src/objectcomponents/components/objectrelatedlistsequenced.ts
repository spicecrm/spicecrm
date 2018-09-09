import {Component, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {Router}   from '@angular/router';
import {ObjectRelatedlistList} from './objectrelatedlistlist';

@Component({
    selector: 'object-relatedlist-list',
    templateUrl: './app/objectcomponents/templates/objectrelatedlistsequenced.html',
    providers: [relatedmodels]
})
export class ObjectRelatedlistSequenced extends ObjectRelatedlistList {

    sequencefield: string = '';

    ngOnInit(){
        super.ngOnInit();

        this.sequencefield = this.componentconfig.sequencefield;
    }
}