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
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-tags',
    templateUrl: './src/objectfields/templates/fieldtags.html'
})
export class fieldTags extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get displayTags() {
        let tagList: string[];
        let tags = this.model.getField( this.fieldname );
        if ( !tags ) return '';
        try {
            tagList = JSON.parse( tags );
        } catch (e) {
            return '';
        }
        return tagList.join(', ');
    }

    /**
     * parses the tags from teh model and returns an array to be handled in the display for loop
     */
    get objecttags() {
        let tags = this.model.getField('tags');
        if (!tags || tags === '') return [];
        else {
            try {
                return JSON.parse(tags);
            } catch (e) {
                return [];
            }
        }
    }

    private removeByIndex(index) {
        let tags = this.objecttags;
        tags.splice(index, 1);
        this.model.setField('tags', JSON.stringify(tags));
    }

    /**
     * adds the tag. This is called fromt eh event emitter ont he input box in the component that fires the tag when a new tag shoudl be added
     *
     * @param tag the tag
     */
    private addTag(tag) {
        if( tag !== '' ) {
            let tags = this.objecttags;
            tags.push( tag );
            this.model.setField( 'tags', JSON.stringify( tags ) );
        }
    }

}
