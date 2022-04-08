/**
 * @module ModuleSpiceTimeStream
 */
import {
    ChangeDetectorRef,
    Component
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {ObjectRelatedList} from "../../../objectcomponents/components/objectrelatedlist";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'spice-timestream',
    templateUrl: '../templates/spicetimestreamrelated.html',
    providers: [relatedmodels]
})
export class SpiceTimestreamRelated extends ObjectRelatedList {

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
        public cdref: ChangeDetectorRef
    ) {
        super(language, metadata, relatedmodels, model, cdref);
    }

}
