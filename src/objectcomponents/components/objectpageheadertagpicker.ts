/**
 * @module ObjectComponents
 */
import { Component, OnInit } from '@angular/core';
import {language} from '../../services/language.service';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';

@Component({
    selector: 'object-page-header-tag-picker',
    templateUrl: '../templates/objectpageheadertagpicker.html',
    styles: [
        '.offeredTags span { cursor: pointer; }',
        '.selectedTags li { margin-bottom: 0.125rem; }',
        '.selectedTags { margin-bottom: -0.125rem; }',
        '::placeholder { font-style: italic; }',
        '.slds-badge { text-transform: none; font-size: 0.75rem; padding-top: 0.1875rem; line-height: 2; }', // 0.75rem == slds-text-body_small
        '.slds-badge:hover { cursor: pointer; filter: brightness(90%); }',
        '.slds-badge.slds-badge_inverse:hover { filter: brightness(133%); }'
    ]
})
export class ObjectPageHeaderTagPicker implements OnInit {

    model: any = {};
    self: any = {};
    tags: Array<string> = [];
    allTags: Array<any> = [];
    offeredTags: Array<any> = [];
    offeredTagsMaxLength = 20;
    numberFilteredTags: number;
    filter: string = '';
    tagsAreParsed: boolean = false;
    allTagsAreLoaded: boolean = false;

    constructor( public language: language, public backend: backend, public toast: toast ) { }

    ngOnInit() {
        this.backend.getRequest('systags').subscribe(( response: any ) => {
            if ( response.systags ) this.allTags = response.systags;
            this.allTagsAreLoaded = true;
            this.doFilter();
        }, ( error: any ) => {
            this.toast.sendToast('Error loading list of available tags.', 'error', null );
            this.closeModal();
        });
        if (this.model.isLoading)
            this.model.data$.subscribe( () => { window.setTimeout(()=>{this.parseTags();},5000); } );
        else
            this.parseTags();
    }

    parseTags() {
        try {
            this.tags = JSON.parse( this.model.data.tags );
        } catch( e ) {
            this.tags = [];
        }
        this.tagsAreParsed = true;
        this.doFilter();
    }

    changeFilter() {
        this.doFilter();
    }

    clearFilter() {
        this.filter = '';
        this.doFilter();
    }

    doFilter() {
        if ( !this.tagsAreParsed || !this.allTagsAreLoaded ) return;
        this.offeredTags.length = 0;
        this.numberFilteredTags = 0;
        for ( let tag of this.allTags ) {
            if( ( this.filter.length === 0 || tag.toLowerCase().indexOf( this.filter.toLowerCase() ) >= 0 ) && this.tags.indexOf( tag ) === -1 ) {
                if ( this.numberFilteredTags++ < this.offeredTagsMaxLength ) this.offeredTags.push( tag );
            }
        }
    }

    addTag( index:number ) {
        if ( this.tags.indexOf( this.offeredTags[index] ) === -1 ) {
            this.tags.push( this.offeredTags[index] );
            this.tags.sort();
            this.offeredTags.splice( index, 1 );
        }
    }

    removeTag( index:number ) {
        /* if ( this.allTags.indexOf( this.tags[index] ) >= 0 ) {
            this.offeredTags.push( this.tags[index] );
            this.offeredTags.sort();
        } */
        this.tags.splice( index, 1 );
        this.doFilter();
    }

    saveAndClose() {
        this.model.setField( 'tags', JSON.stringify( this.tags ));
        this.model.save();
        this.closeModal();
    }

    closeModal() {
        this.self.destroy();
    }

    onModalEscX() {
        this.closeModal();
    }

}
