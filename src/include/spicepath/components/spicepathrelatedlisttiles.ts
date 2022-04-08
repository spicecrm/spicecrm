/**
 * @module ModuleSpicePath
 */
import {Component} from "@angular/core";

import {ObjectRelatedList} from "../../../objectcomponents/components/objectrelatedlist";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    templateUrl: "../templates/spicepathrelatedlisttiles.html",
    providers: [relatedmodels]
})
export class SpicePathRelatedListTiles extends ObjectRelatedList {}
