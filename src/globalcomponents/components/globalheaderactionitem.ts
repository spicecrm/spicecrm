import {Component, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {session} from '../../services/session.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {dockedComposer} from '../../services/dockedcomposer.service';

@Component({
    selector: 'global-header-action-item',
    templateUrl: './app/globalcomponents/templates/globalheaderactionitem.html',
    providers: [model]
})
export class GlobalHeaderActionItem implements OnInit {

    actionconfig: any = {};
    closemenu: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private session: session, private metadata: metadata, private model: model, private language: language, private dockedComposer: dockedComposer) {

    }

    ngOnInit() {
        if (this.actionconfig.module)
            this.model.module = this.actionconfig.module
    }

    click() {
        this.dockedComposer.addComposer(this.model.module);
        this.closemenu.emit(true);
    }

    get label() {
        if (this.actionconfig.label)
            return this.language.getLabel(this.actionconfig.label);
        else
            return this.language.getModuleLabel(this.model.module, 'LBL_NEW_FORM_TITLE');
    }

}