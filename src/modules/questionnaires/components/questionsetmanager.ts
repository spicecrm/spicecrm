/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleQuestionnaire
 */
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {model} from "../../../services/model.service";
import { language } from '../../../services/language.service';
import { modal } from '../../../services/modal.service';

@Component({
    selector: 'questionset-manager',
    templateUrl: "./src/modules/questionnaires/templates/questionsetmanager.html",
    providers: [ model ]
})
export class QuestionsetManager implements OnInit {

    @Input() public questionset: any;
    @Input() public categorypool: any;
    @Output() public changed = new EventEmitter();
    @Output() public deleted = new EventEmitter();

    private currentPosition: number;

    constructor( private model: model, private lang: language, private modalservice: modal ) { }

    public ngOnInit(): void {
        this.model.module = 'QuestionSets';
        this.model.id = this.questionset.id;
        this.model.data = this.questionset;
        this.currentPosition = this.questionset.position;
        this.model.data$.subscribe( () => {
            this.changed.emit( this.model.data );
        });
    }

    private questionsetAction( action: string ): void {
        switch( action ) {
            case 'edit':
                this.model.edit();
                break;
            case 'delete':
                this.modalservice.confirm( 'Sind Sie sicher, dass Sie diese Fragegruppe löschen wollen?', 'Fragegruppe löschen?', 'shade' ).subscribe( answer => {
                    if ( answer ) {
                        this.model.delete();
                        this.deleted.emit();
                    }
                });
        }
    }


    private dragStarted(e) {
        e.source.element.nativeElement.classList.add('slds-is-selected');
    }

    private dragEnded(e) {
        e.source.element.nativeElement.classList.remove('slds-is-selected');
    }

}
