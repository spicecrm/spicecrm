/**
 * @module ObjectComponents
 */
import {Component, AfterViewInit, OnInit, ViewChildren, QueryList} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {Router} from '@angular/router';
import {ObjectRelatedlistList} from "./objectrelatedlistlist";

@Component({
    selector: 'object-relatedlist-tiles',
    templateUrl: './src/objectcomponents/templates/objectrelatedlisttiles.html',
    providers: [relatedmodels]
})
export class ObjectRelatedlistTiles extends ObjectRelatedlistList {}
