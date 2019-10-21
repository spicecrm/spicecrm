import { ChangeDetectorRef, Component, forwardRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import {language} from "../../services/language.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { backend } from '../../services/backend.service';

declare var window: any;

@Component({
    selector: 'system-input-tags-2',
    templateUrl: './src/systemcomponents/templates/systeminputtags2.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputTags2 ),
            multi: true
        }
    ],
    styles: [
        '.slds-pill_container > ul > li, .slds-pill_container > ul > li+li { padding: 0.25rem 0 0 0.25rem; }',
        '.slds-pill_container > ul { padding: 0 0.25rem 0.25rem 0; }',
        'system-utility-icon { cursor: pointer; }',
        'input { line-height: 1.5rem; padding: 0 0.5rem; min-height: 0; border-style: dashed; border-color: rgb(110,110,110); }',
        '.slds-pill--label, .slds-pill__label { padding: 0 0.125rem; }',
        '.slds-dropdown { transform: none; left: 0; }',
        '.slds-dropdown--fluid, .slds-dropdown_fluid { min-width: auto; }'
    ]
})
export class SystemInputTags2 implements ControlValueAccessor {

    @Input() public isEditing = true;
    @Input() public maxNumber = null;
    @Input() public id = '';

    @ViewChild('taglist', { read: ViewContainerRef, static: true }) private taglist: ViewContainerRef;

    private tags: string[] = []; // the tags
    private tagsLower: string[] = []; // the lower-case variants of the tags

    // for the dropdown
    private queryString = '';
    private queryTimeout: number = undefined;
    private proposedTags: string[] = [];
    private matchedTagsFromBackend: string[] = [];

    private inputFieldHasFocus = false;
    private console: any;

    private selectedProposal = -1;
    private hoveredProposal = -1;

    private isOpen = false;
    private lastTypedQueryString = '';

    constructor( private lang: language, private backend: backend, private changeDetRef: ChangeDetectorRef ) {
        this.console = window.console;
    }

    public propagateChange = (_) => { 1; };

    // this method sets the value programmatically
    public writeValue( tagsAsString: string ): void {
        if ( !tagsAsString || tagsAsString === '' ) this.tags = [];
        else {
            try {
                this.tags = JSON.parse( tagsAsString );
            } catch (e) {
                this.tags = [];
            }
        }
        this.tagsToLowerCase();
    }

    private tagsToLowerCase(): void {
        for ( let i=0; i< this.tags.length; i++ ) this.tagsLower[i] = this.tags[i].toLocaleLowerCase();
        this.tagsLower.length = this.tags.length;
    }

    // upon UI element value changes, this method gets triggered
    public registerOnChange( fn: any ): void {
        this.propagateChange = fn;
    }

    public registerOnTouched( fn: any ): void { 1; }

    public addTag( tag: string, typedIn = false ): void {
        tag = tag.trim();
        if ( tag === '' || this.maxNumberReached ) return;
        let tagLower = tag.toLocaleLowerCase();
        let position = this.tagsLower.indexOf( tagLower ); // Is the tag already in the list?
        if ( position === -1 ) { // No? --> Add it to the list.
            this.tags.push( tag );
            this.lang.sortArray( this.tags );
            // this.tagsLower.push( tagLower );
            // this.lang.sortArray( this.tagsLower );
            this.tagsToLowerCase();
            // if ( event ) event.target.value = '';
            // this.queryString = this.lastTypedQueryString;
            // if ( typedIn ) this.queryString = '';
            if ( this.lastTypedQueryString === this.queryString ) this.queryString = '';
            this.propagateChange( JSON.stringify( this.tags ));
            if ( this.maxNumberReached ) this.queryString = '';
            this.determineProposedTags();
            this.doNewPosition();
            this.changeDetRef.detectChanges();
        } else this.highlightTag( position ); // Yes? --> Highlight it to draw attention to it.
    }

    private doNewPosition() {
        if ( this.selectedProposal > this.proposedTags.length-1 ) this.selectedProposal = this.proposedTags.length-1;
        if ( this.selectedProposal < 0 ) {
            this.isOpen = false;
            this.queryString = this.lastTypedQueryString;
        } else this.queryString = this.proposedTags[this.selectedProposal];
    }

    private get maxNumberReached(): boolean {
        return !this.maxNumber || this.tags.length >= this.maxNumber;
    }

    private highlightTag( tagIndex: number ): void {
        let tagStyle = this.taglist.element.nativeElement.children[tagIndex].children[0].style;
        tagStyle.boxShadow = '0 0 5px 5px #f66';
        tagStyle.transition = 'box-shadow 100ms';
        window.setTimeout( () => {
            tagStyle.transition = 'box-shadow 1500ms';
            tagStyle.boxShadow = null;
        }, 100 );
    }

    private removeByIndex( index ): void {
        this.tags.splice( index, 1 );
        this.tagsLower.splice( index, 1 );
        this.propagateChange( JSON.stringify( this.tags ));
        this.determineProposedTags();
    }

    private search( event ) {
        // handle the key pressed
        switch ( event.key ) {
            case 'Escape':
                if ( this.isOpen ) {
                    this.isOpen = false;
                    event.stopPropagation();
                    this.queryString = this.lastTypedQueryString;
                }
                break;
            case 'ArrowDown':
                if ( !this.isOpen ) {
                    this.switchOnProposalsIfOff();
                    this.selectedProposal = -1;
                    break;
                }
                this.switchOnProposalsIfOff();
                if ( this.proposedTags.length > 0 ) {
                    this.selectedProposal++;
                    if ( this.selectedProposal === this.proposedTags.length ) this.selectedProposal = 0;
                    this.queryString = this.proposedTags[this.selectedProposal];
                }
                break;
            case 'ArrowUp':
                if ( !this.isOpen ) {
                    this.switchOnProposalsIfOff();
                    this.selectedProposal = -1;
                    break;
                }
                this.switchOnProposalsIfOff();
                if ( this.proposedTags.length > 0 ) {
                    this.selectedProposal--;
                    if ( this.selectedProposal === -1 ) this.selectedProposal = this.proposedTags.length-1;
                    this.queryString = this.proposedTags[this.selectedProposal];
                }
                break;
            case ',':
            case ';':
            case 'Enter':
                this.addTag( this.queryString, true ); // .replace(/^[\s]+|[\s\W]+$/gm, '')
                break;
            default:
                if ( this.proposedTags[this.selectedProposal] !== this.queryString ) { // ??????????????????
                    this.lastTypedQueryString = this.queryString;
                    if ( this.queryTimeout ) window.clearTimeout( this.queryTimeout );
                    this.queryTimeout = window.setTimeout( () => this.doSearch(), 500 );
                }
                break;
        }
    }

    private doSearch(): void {
        this.backend.postRequest('SpiceTags', {},  { search: this.queryString.trim() }).subscribe( tags => {
            // this.matchedTagsFromBackend = tags;
            this.matchedTagsFromBackend = ['Landwirtschaft','IT','Pflege','Medizin','Architektur','Maschinenbau','Hochbau','Tiefbau','Gastronomie']; // provisorisch, solange nix vom Backend
            this.matchedTagsFromBackend.sort((a, b) => a.localeCompare(b) );
            this.determineProposedTags();
            if ( this.inputFieldHasFocus ) this.switchOnProposalsIfOff();
        });
    }

    private switchOnProposalsIfOff(): void {
        if ( this.isOpen || this.proposedTags.length === 0 ) return;
        this.isOpen = true;
        this.selectedProposal = -1;
    }

    private determineProposedTags(): void {
        // this.proposedTags = this.matchedTagsFromBackend; // for debugging
        // return; // for debugging
        this.proposedTags = this.matchedTagsFromBackend.filter( ( string) => {
            let stringLower = string.toLocaleLowerCase();
            if ( this.lastTypedQueryString.length === 0 ) return false;
            if ( stringLower.indexOf( this.lastTypedQueryString.toLocaleLowerCase() ) === -1 ) return false;
            if ( this.tagsLower.indexOf( stringLower ) !== -1 ) return false;
            return true;
        });
    }

    private inputFieldGotFocus( status ) {
        if ( status === false ) {
            this.queryString = this.lastTypedQueryString;
            this.isOpen = false;
        }
        this.inputFieldHasFocus = status;
    }

    private proposalIsHighlighted( i ): boolean {
        if ( this.hoveredProposal > -1 ) return this.hoveredProposal === i;
        else return this.selectedProposal === i;
    }

    private hover( i: number ) {
        this.hoveredProposal = i;
        this.selectedProposal = -1;
    }

}
