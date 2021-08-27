/**
 * @module ObjectComponents
 */
import {Component, Input} from '@angular/core';

import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from "../../services/language.service";
import {userpreferences} from "../../services/userpreferences.service";
import {session} from "../../services/session.service";
import {timeline} from "../../services/timeline.service";

declare var moment;

@Component({
    selector: 'object-timeline-stencil',
    templateUrl: './src/objectcomponents/templates/objecttimelinestencil.html'
})
export class ObjectTimelineStencil {

    constructor(private timeline: timeline) {
    }

}
