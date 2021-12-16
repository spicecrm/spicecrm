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
    templateUrl: '../templates/fieldtags.html'
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
        if( tag !== '' ) {
            let tags = this.objecttags;
            tags.push( tag );
            this.model.setField( 'tags', JSON.stringify( tags ) );
        }
    }

}
