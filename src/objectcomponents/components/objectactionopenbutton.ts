/**
 * @module ObjectComponents
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";

/**
 * a standard actionset item to open a model
 */
@Component({
    selector: 'object-action-open-button',
    templateUrl: './src/objectcomponents/templates/objectactionopenbutton.html',
    providers: [helper]
})
export class ObjectActionOpenButton {

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private helper: helper, private view: view) {
    }

    get disabled() {
        return !this.model.checkAccess('detail') ? true : this.view.isEditMode();
    }

    public execute() {
        this.model.goDetail();
    }

}