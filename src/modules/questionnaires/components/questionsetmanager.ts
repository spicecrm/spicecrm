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
    @Output() public newPosition = new EventEmitter();
    @Output() public deleted = new EventEmitter();

    private currentPosition: number;

    constructor( private model: model, private lang: language, private modalservice: modal ) { }

    public ngOnInit(): void {
        this.model.module = 'QuestionSets';
        this.model.id = this.questionset.id;
        this.model.data = this.questionset;
        this.currentPosition = this.questionset.position;
        this.model.data$.subscribe( () => {
           if ( this.currentPosition !== this.model.data.position ) this.newPosition.emit( this.model.data.position );
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

}
