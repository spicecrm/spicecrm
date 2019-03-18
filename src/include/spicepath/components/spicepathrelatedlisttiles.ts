/**
 * @module ModuleSpicePath
 */
import {Component} from "@angular/core";

import {ObjectRelatedlistList} from "../../../objectcomponents/components/objectrelatedlistlist";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    templateUrl: "./src/include/spicepath/templates/spicepathrelatedlisttiles.html",
    providers: [relatedmodels]
})
export class SpicePathRelatedListTiles extends ObjectRelatedlistList {}