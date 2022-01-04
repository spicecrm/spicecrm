/**
 * @module GlobalComponents
 */
import {Component, EventEmitter, OnInit} from '@angular/core';
import {session} from '../../../services/session.service';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {dockedComposer} from '../../../services/dockedcomposer.service';
import {GlobalHeaderActionItem} from '../../../globalcomponents/components/globalheaderactionitem';
import {modal} from '../../../services/modal.service';

@Component({
    selector: 'questionnaire-fill-out-action-item',
    templateUrl: '../../../globalcomponents/templates/globalheaderactionitem.html',
    providers: [model]
})
export class QuestionnaireFillOutActionItem extends GlobalHeaderActionItem implements OnInit {

    public actionconfig: any = {};
    public closemenu: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor( public session: session, public metadata: metadata, public model: model, public language: language, public dockedComposer: dockedComposer, public modal: modal ) {
        super( session, metadata, model, language, dockedComposer );
    }

    public ngOnInit() {
        this.model.module = 'Questionnaires';
    }

    public click() {
        this.modal.openModal('QuestionnaireFillOutModal');
        this.closemenu.emit(true);
    }

}
