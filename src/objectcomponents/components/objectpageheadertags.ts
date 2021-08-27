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