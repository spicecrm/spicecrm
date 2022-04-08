/**
 * @module ServiceComponentsModule
 */
import {
    Component, ElementRef, OnInit, ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {dockedComposer} from '../../../services/dockedcomposer.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';
import {ActivityTimelineAddItem} from "../../../modules/activities/components/activitytimelineadditem";

@Component({
    templateUrl: '../templates/serviceactivitiytimelineaddservicenote.html',
    providers: [model, view]
})
export class ServiceActivitiyTimelineAddServiceNote extends ActivityTimelineAddItem {

    /*
    constructor(public metadata: metadata, public activitiytimeline: activitiytimeline, public model: model, public view: view, public language: language, public modal: modal, public dockedComposer: dockedComposer, public ViewContainerRef: ViewContainerRef) {
        super(metadata, activitiytimeline, model, view, language, modal, dockedComposer, ViewContainerRef);
    }
    */
}
