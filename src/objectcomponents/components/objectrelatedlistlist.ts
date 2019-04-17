/**
 * @module ObjectComponents
 */
import { Component, AfterViewInit, OnInit, OnDestroy, ViewChildren, QueryList, Input } from "@angular/core";
import {relatedmodels} from "../../services/relatedmodels.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {ObjectRelatedList} from './objectrelatedlist';

@Component({
    selector: "object-relatedlist-list",
    templateUrl: "./src/objectcomponents/templates/objectrelatedlistlist.html",
    providers: [relatedmodels]
})
export class ObjectRelatedlistList extends ObjectRelatedList {}
