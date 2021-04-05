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
import {
    Component, ElementRef, ViewChild, ChangeDetectorRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {footer} from '../../services/footer.service';
import {language} from "../../services/language.service";
import {modal} from '../../services/modal.service';

/**
 * renders a list of tags int eh object page header and allows editing and management of the tags
 */
@Component({
    selector: 'object-page-header-tags',
    templateUrl: './src/objectcomponents/templates/objectpageheadertags.html'
})
export class ObjectPageHeaderTags {

    /**
     * indicates if we are editing
     */
    private isEditing: boolean = false;

    constructor(private model: model, private metadata: metadata, private language: language) {
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

    /**
     * checks if the module is set for tagging in the metadata service
     */
    get taggingEnabled() {
        return this.metadata.checkTagging(this.model.module);
    }

    /**
     * switch to editing mode
     */
    private editTags() {
        this.isEditing = true;
        this.model.startEdit();
        /*
        this.modalservice.openModal('ObjectPageHeaderTagPicker').subscribe(cmp => {
            cmp.instance.model = this.model;
        });
        */
    }

    /**
     * cancels the editing process
     */
    private cancelEdit() {
        this.isEditing = false;
        this.model.cancelEdit();
    }

    /**
     * saves the changes
     */
    private saveTags() {
        this.model.save();
        this.isEditing = false;
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
        let tags = this.objecttags;
        tags.push(tag);
        this.model.setField('tags', JSON.stringify(tags));
    }
}
