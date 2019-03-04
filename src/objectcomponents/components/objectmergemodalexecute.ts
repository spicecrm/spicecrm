/**
 * @module ObjectComponents
 */
import { Component } from '@angular/core';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-merge-modal-execute',
    templateUrl: './src/objectcomponents/templates/objectmergemodalexecute.html'
})
export class ObjectMergeModalExecute {

    constructor( private language: language, private metadata: metadata, private model: model ) {

    }

}