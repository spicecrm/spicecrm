/**
 * @module ModuleQuestionnaire
 */
import { Component, EventEmitter, Input, OnInit, Output, SkipSelf } from "@angular/core";
import {model} from "../../../services/model.service";
import { language } from '../../../services/language.service';
import { modal } from '../../../services/modal.service';

@Component({
    selector: 'questionset-manager',
    templateUrl: "../templates/questionsetmanager.html",
    providers: [ model ]
})
export class QuestionsetManager implements OnInit {

    @Input() public questionset: any;
    @Input() public categorypool: any;
    @Output() public changed = new EventEmitter();
    @Output() public deleted = new EventEmitter();

    public currentPosition: number;

    constructor( @SkipSelf() public questionnaire: model, public model: model, public lang: language, public modalservice: modal ) { }

    public ngOnInit(): void {
        this.model.module = 'QuestionSets';
        this.model.id = this.questionset.id;
        this.model.setData(this.questionset);
        this.currentPosition = this.questionset.position;
        this.model.data$.subscribe( () => {
            this.changed.emit( this.model.data );
        });
    }

    public questionsetAction( action: string ): void {
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


    public dragStarted(e) {
        e.source.element.nativeElement.classList.add('slds-is-selected');
    }

    public dragEnded(e) {
        e.source.element.nativeElement.classList.remove('slds-is-selected');
    }

}
