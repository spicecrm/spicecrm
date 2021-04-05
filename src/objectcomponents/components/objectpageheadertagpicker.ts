/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ObjectComponents
 */
import { Component, OnInit } from '@angular/core';
import {language} from '../../services/language.service';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';

@Component({
    selector: 'object-page-header-tag-picker',
    templateUrl: './src/objectcomponents/templates/objectpageheadertagpicker.html',
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

    constructor( private language: language, private backend: backend, private toast: toast ) { }

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
