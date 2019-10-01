import { Component, forwardRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
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
        'li, li+li { padding: 0.25rem 0 0 0.25rem; }',
        'ul { padding: 0 0.25rem 0.25rem 0; }',
        'system-utility-icon { cursor: pointer; }',
        'input { line-height: 1.5rem; padding: 0 0.5rem; min-height: 0; border-style: dashed; border-color: rgb(110,110,110); }',
        '.slds-pill__label { padding: 0 0.125rem; }'
    ]
})
export class SystemInputTags2 implements ControlValueAccessor {

    @Input() public isLoading = false;
    @Input() public isEditing = true;
    @Input() public maxNumber = null;

    @Input() public isRequired = false;
    @Input() public label = '';

    @ViewChild('taglist', {read: ViewContainerRef}) private taglist: ViewContainerRef;

    private tags: string[] = []; // the tags
    private tagsLower: string[] = []; // the lower-case variants of the tags

    // for the dropdown
    private querystring: string = '';
    private querytimeout: any = undefined;
    private matchedtags: string[] = [];
    private matchedtagindex: number;

    constructor( private lang: language, private backend: backend ) { }

    public onChange = (_) => { 1; };

    /*
    set value( val ) { // this value is updated by programmatic changes
        if ( val !== undefined ) { // && this.tags !== val ) {
            this.tags = val;
        //    this.onChange( val );
        }
    }
    */

    // this method sets the value programmatically
    public writeValue( value: any ) {
        if ( value ) {
            this.tags = value;
            this.tagsToLowerCase();
        } else this.tags = [];
    }

    private tagsToLowerCase() {
        for ( let i=0; i< this.tags.length; i++ ) {
            this.tagsLower[i] = this.tags[i].toLocaleLowerCase();
        }
        this.tagsLower.length = this.tags.length;
    }

    // upon UI element value changes, this method gets triggered
    public registerOnChange( fn: any ) {
        this.onChange = fn;
    }

    public registerOnTouched( fn: any ) { 1; }

    public addTag( event ) {
        if ( this.maxNumberReached ) return;
        let tag = event.target.value;
        tag = tag.trim();
        if ( tag === '' ) return;
        let tagLower = tag.toLocaleLowerCase();
        let position = this.tagsLower.indexOf( tagLower ); // Is the tag already in the list?
        if ( position === -1 ) { // No? --> Add it to the list.
            this.tags.push( tag );
            this.tagsLower.push( tagLower );
            event.target.value = '';
            this.onChange( this.tags );
        } else this.highlightTag( position ); // Yes? --> Highlight it to draw attention to it.
    }

    private get maxNumberReached(): boolean {
        return !this.maxNumber || this.tags.length >= this.maxNumber;
    }

    private highlightTag( tagIndex: number ): void {
        let tagStyle = this.taglist.element.nativeElement.children[tagIndex].children[0].style;
        tagStyle.boxShadow = '0 0 5px 5px #f66';
        tagStyle.transition = 'box-shadow 100ms';
        window.setTimeout( () => {
            tagStyle.transition = 'box-shadow 1000ms';
            tagStyle.boxShadow = null;
        }, 100 );
    }

    private removeByIndex( index ) {
        this.tags.splice( index, 1 );
        this.tagsLower.splice( index, 1 );
        this.onChange( this.tags );
    }

    get isOpen(): boolean {
        return this.matchedtags.length > 0;
    }


    private search(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case ',':
            case ';':
            case 'Enter':
                this.addTag(this.querystring.replace(/^[\s]+|[\s\W]+$/gm, ''))
                break;
            default:
                if (this.querytimeout) window.clearTimeout(this.querytimeout);
                this.querytimeout = window.setTimeout(() => this.doSearch(), 500);
                break;
        }
    }

    private doSearch() {
        /*
        this.backend.getRequest('/SpiceTags/' + btoa(this.querystring.trim())).subscribe(tags => {
            this.matchedtags = tags;
            this.matchedtags.sort((a, b) => {
                return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
            });
        });
        */
        this.backend.postRequest('/SpiceTags', {},  {search: this.querystring.trim()}).subscribe(tags => {
            this.matchedtags = tags;
            this.matchedtags = ['Kirche','Kapelle','Kathethrale','Dom','Basilika','Babptisterium'];
            this.matchedtags.sort((a, b) => {
                return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
            });
        });
    }

}
