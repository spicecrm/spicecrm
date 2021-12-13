/**
 * @module ModuleScrum
 */
import {Component} from '@angular/core';
import {modellist} from '../../../services/modellist.service';
import {scrum} from "../services/scrum.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'scrum-main',
    templateUrl: '../templates/scrummain.html',
    providers: [scrum]
})
export class ScrumMain {

    constructor(public scrum: scrum, public modellist: modellist, public language: language) {
        this.loadList();
    }

    /**
     * load the list data
     */
    public loadList() {
        this.modellist.getListData();
    }

    /**
     * getter for the text
     */
    get text() {
        return this.language.getLabel('LBL_SELECT_THEME');
    }
}

