/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit, ViewChild, ViewContainerRef, Input, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { metadata } from '../../../services/metadata.service';
import { language } from '../../../services/language.service';
import { backend } from '../../../services/backend.service';
import { DomSanitizer } from '@angular/platform-browser';
import { toast } from '../../../services/toast.service';
import { configurationService } from '../../../services/configuration.service';

@Component({
    selector: 'questionnaire-interpretation-assignment',
    templateUrl: '../templates/questionnaireinterpretationassignment.html',
    styles: [
        "ul.interpretations { margin-right: -1rem; }",
        "ul.interpretations > li { float: left; width: 50%; }",
        "ul.interpretations > li:nth-child(odd) { clear: left; }",
        "ul.interpretations > li > div { margin-right: 1rem; }"
    ]
})
export class QuestionnaireInterpretationAssignment implements OnInit {

    public self: any = null;

    public reference_id: string;
    public reference_module: string;

    public isLoading = true;
    public nrAssignedInterpretationsChanged = 0;
    public suggestedInterpretations = [];
    public meta = {};
    public assignedInterpretations = [];
    public evaluationIsOpen = true;
    public allInterpretations = [];
    public questionnaireId: string;
    public clickListener: any;
    public offeredInterpretationsAreExpanded = false;
    public someExtraTextIsChanged = false;

    @ViewChild( 'divOfferedInterpretations', {read: ViewContainerRef, static: false}) public divOfferedInterpretations: ViewContainerRef;

    constructor( public conf: configurationService, public language: language, public backend: backend, public metadata: metadata, public sanitized: DomSanitizer, public toast: toast, public renderer: Renderer2 ) { }

    public ngOnInit(): void {

        this.backend.getRequest( 'module/QuestionnaireParticipations/byParent/SUPConsultingOrderItems/' + this.reference_id + '/questionnaireId').subscribe(( data: any ) => {
            this.questionnaireId = data.questionnaireId;
            this.backend.getRequest( 'module/Questionnaires/' + this.questionnaireId + '/related/questionnaireinterpretations', {limit: 999} ).subscribe(( data: any ) => {
                for( let interpretation in data ) {
                    if ( data.hasOwnProperty( interpretation )) this.allInterpretations.push( data[interpretation] );
                }
                if ( this.assignedInterpretations ) this.isLoading = false;
            });
        });

        this.backend.getRequest( 'module/' + this.reference_module + '/' + this.reference_id + '/related/questionnaireinterpretations', {limit: 999} ).subscribe(( data: any ) => {
            for ( let prop in data ) {
                if ( data.hasOwnProperty( prop )) this.assign( data[prop], true );
            }
            if ( this.allInterpretations ) this.isLoading = false;
        });

    }

    public isAssigned( interpretationId: string ): boolean {
        return this.meta[interpretationId] && this.meta[interpretationId].assigned === true;
    }

    public assign( interpretation: any, initial = false ): void {
        if( !this.meta[interpretation.id] ) {
            this.meta[interpretation.id] = { id: interpretation.id, nativelyAssigned: initial, object: interpretation };
        }
        this.meta[interpretation.id].assigned = true;
        if ( typeof interpretation.text_extra === 'undefined' ) interpretation.text_extra = '';
        this.meta[interpretation.id].nativelyTextExtra = interpretation.text_extra;
        this.meta[interpretation.id].editMode = false;
        interpretation.htmlSanitized = this.sanitized.bypassSecurityTrustHtml('<html><head><style>' + this.metadata.getHtmlStylesheetCode( interpretation.text_short_stylesheet_id ) + '</style></head><body class="spice">'+interpretation.text_short+'</body></html>');
        interpretation.textExtraSanitized = this.sanitized.bypassSecurityTrustHtml('<html><head><style>' + this.metadata.getHtmlStylesheetCode( interpretation.text_short_stylesheet_id ) + '</style></head><body class="spice">'+interpretation.text_extra+'</body></html>');
        this.assignedInterpretations.push( interpretation );
        if ( this.meta[interpretation.id].nativelyAssigned === true && !initial ) this.nrAssignedInterpretationsChanged--;
        if ( this.meta[interpretation.id].nativelyAssigned === false ) this.nrAssignedInterpretationsChanged++;
    }

    public addOffered( interpretation: any ): void {
        if ( !this.isAssigned( interpretation.id )) this.assign( interpretation );
    }

    public get offeredInterpretations(): any[] {
        let out = [];
        for ( let interpretation of this.allInterpretations ) {
            if( !this.isAssigned( interpretation.id )) out.push( interpretation );
        }
        return out;
    }

    public complementWithSuggestion(): void {
        this.backend.getRequest( 'module/QuestionnaireParticipations/byParent/'+this.reference_module+'/'+this.reference_id+'/interpretationsSuggested').subscribe(( data: any ) => {
            this.suggestedInterpretations = data;
            if ( this.suggestedInterpretations.length === 0 ) {
                this.toast.sendToast( 'Keine passenden Interpretationen gefunden.', 'warning', '', true );
            } else {
                let nrAdded = 0;
                this.suggestedInterpretations.some( ( interpretation, index ) => {
                    if( !this.isAssigned( interpretation.id ) ) {
                        this.assign( interpretation );
                        nrAdded++;
                    }
                    return false;
                } );
                if ( nrAdded ) this.toast.sendToast( nrAdded + ' Interpretationen hinzugefügt.', 'success', '', true );
                else this.toast.sendToast( 'Alle passenden Interpretationen bereits in der Liste.', 'info', '', true );
                this.isLoading = false;
            }
        });
    }

    public removeSingle( index: number ): void {
        let interpretation = this.assignedInterpretations[index];
        if ( !this.isAssigned( interpretation.id )) return;
        this.meta[interpretation.id].assigned = false;
        interpretation.text_extra = this.meta[interpretation.id].nativelyTextExtra;
        if ( this.meta[interpretation.id].nativelyAssigned === true ) this.nrAssignedInterpretationsChanged++;
        if ( this.meta[interpretation.id].nativelyAssigned === false ) this.nrAssignedInterpretationsChanged--;
        this.assignedInterpretations.splice( index, 1 );
    }

    public closeModal(): void {
        let toDelete = [];
        let toAdd = [];
        let toUpdateExtraText = [];
        for ( let prop in this.meta ) {
            if ( this.meta.hasOwnProperty( prop )) {
                const metaItem = this.meta[prop];
                const assignmentHasChanged = metaItem.assigned !== metaItem.nativelyAssigned || metaItem.nativelyTextExtra !== metaItem.object.text_extra;
                const extraTextHasChanged = metaItem.nativelyTextExtra !== metaItem.object.text_extra;
                if ( assignmentHasChanged ) {
                    if( metaItem.assigned ) toAdd.push( metaItem.object.id );
                    else toDelete.push( metaItem.object.id );
                }
                if ( extraTextHasChanged ) toUpdateExtraText.push( metaItem.object.id );
            }
        }
        if ( toDelete.length ) {
            this.backend.deleteRequest( 'module/' + this.reference_module + '/' + this.reference_id + '/related/questionnaireinterpretations', { relatedids: JSON.stringify( toDelete ) } );
        }
        if ( toAdd.length ) {
            this.backend.postRequest( 'module/' + this.reference_module + '/' + this.reference_id + '/related/questionnaireinterpretations',[], toAdd );
        }
        if ( toUpdateExtraText.length ) {
            for ( let item of toUpdateExtraText ) {
                this.backend.putRequest( 'module/' + this.reference_module + '/' + this.reference_id + '/related/questionnaireinterpretations', [], {
                    id: item,
                    text_extra: this.meta[item].object.text_extra
                } );
            }
        }

        this.self.destroy();
    }

    public cancelModal(): void {
        this.self.destroy();
    }

    public toggleEvaluation(): void {
        this.evaluationIsOpen = !this.evaluationIsOpen;
    }

    public getEvaluationStyle(): object {
        if ( !this.evaluationIsOpen ) {
            return {
                height: '0px',
                transform: 'rotateX(90deg)',
                display: 'block'
            };
        }
    }

    public onClick( event: MouseEvent ): void {
        if ( ! this.divOfferedInterpretations.element.nativeElement.contains( event.target ) ) { // not clicked inside?
            this.offeredInterpretationsAreExpanded = false;
            this.clickListener();
        }
    }

    public toggleOfferedInterpretations(): void {
        if ( this.offeredInterpretationsAreExpanded ) this.closeOfferedInterpretations();
        else this.openOfferedInterpretations();
    }
    public openOfferedInterpretations(): void {
        this.offeredInterpretationsAreExpanded = true;
        this.clickListener = this.renderer.listen('document', 'click', event => this.onClick(event));
    }
    public closeOfferedInterpretations(): void {
        this.offeredInterpretationsAreExpanded = false;
        if ( this.clickListener ) this.clickListener();
    }

    public ngOnDestroy(): void {
        if ( this.clickListener && this.clickListener.destroy ) this.clickListener.destroy();
    }

    public updateField( index ): void {
        if ( this.meta[this.assignedInterpretations[index].id].nativelyTextExtra !== this.assignedInterpretations[index].text_extra ) {
            this.someExtraTextIsChanged = true;
        }
    }

    public toggleEditMode( interpretationId: string ): void {
        this.meta[interpretationId].editMode = !this.meta[interpretationId].editMode;
    }

    public closeEditMode( interpretationId: string ): void {
        this.meta[interpretationId].editMode = false;
    }

}
