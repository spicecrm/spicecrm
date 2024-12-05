/**
 * @module ObjectComponents
 */
import {
    Component,
    ChangeDetectorRef
} from "@angular/core";
import {relatedmodels} from "../../services/relatedmodels.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {ObjectRelatedList} from './objectrelatedlist';
import {view} from "../../services/view.service";

@Component({
    selector: "object-relatedlist-cards",
    templateUrl: "../templates/objectrelatedlistcards.html",
    providers: [relatedmodels, view]
})
export class ObjectRelatedlistCards extends ObjectRelatedList {

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
        public cdref: ChangeDetectorRef,
        public view: view
    ) {
        super(language, metadata, relatedmodels, model, cdref);

        this.view.isEditable = false;
    }

    get hide(){
        return this.componentconfig.hideempty && this.relatedmodels.count == 0;
    }

}
