import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { language } from '../../services/language.service';
import { popup } from '../../services/popup.service';

@Component({
    selector: 'object-merge-modal-execute',
    templateUrl: './src/objectcomponents/templates/objectmergemodalexecute.html'
})
export class ObjectMergeModalExecute {

    constructor( private language: language, private metadata: metadata, private model: model ) {

    }

}