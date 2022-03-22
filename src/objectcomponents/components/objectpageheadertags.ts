/**
 * @module ObjectComponents
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from "../../services/language.service";
import {toast} from "../../services/toast.service";


/**
 * renders a list of tags int eh object page header and allows editing and management of the tags
 */
@Component({
    selector: 'object-page-header-tags',
    templateUrl: '../templates/objectpageheadertags.html'
})
export class ObjectPageHeaderTags {

    /**
     * indicates if we are editing
     */
    public isEditing: boolean = false;

    constructor(public model: model, public metadata: metadata, public language: language, public toast: toast) {
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
    public editTags() {
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
    public cancelEdit() {
        this.isEditing = false;
        this.model.cancelEdit();
    }

    /**
     * saves the changes
     */
    public saveTags() {
        this.model.save();
        this.isEditing = false;
    }

    public removeByIndex(index) {
        let tags = this.objecttags;
        tags.splice(index, 1);
        this.model.setField('tags', JSON.stringify(tags));
    }

    /**
     * adds the tag. This is called fromt eh event emitter ont he input box in the component that fires the tag when a new tag shoudl be added
     *
     * @param tag the tag
     */
    public addTag(tag) {
        // convert array tags to lower case for easier check
        let tags = this.objecttags.map(tagV => tagV.toLowerCase());
        // check if tag exists in array
        if(tags.includes(tag.toLowerCase())) {
            this.toast.sendToast(this.language.getLabel('LBL_TAG_EXISTS', '', 'short'), 'warning');
            return;
        } else {
            this.objecttags.indexOf(tag);
            tags.push(tag)
        }
        this.model.setField('tags', JSON.stringify(tags));
    }
}
