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
import {navigationtab} from "../../services/navigationtab.service";

/**
 * a standard actionset item to open a model
 */
@Component({
    selector: 'object-action-open-button',
    templateUrl: '../templates/objectactionopenbutton.html',
    providers: [helper]
})
export class ObjectActionOpenButton {

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public router: Router,
        public helper: helper,
        public view: view,
        public navigationtab: navigationtab,
    ) {
    }

    /**
     * checks if the user is allowed to access the bean
     */
    get disabled() {
        return !this.model.checkAccess('detail') ? true : this.view.isEditMode();
    }

    /**
     * opens the modal with the record
     */
    public execute() {
        this.model.goDetail(this.navigationtab.tabid);
    }

}
