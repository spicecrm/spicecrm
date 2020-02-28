/**
 * @module ModuleScrum
 */
import {Component} from '@angular/core';
import {modellist} from '../../../services/modellist.service';
import {scrum} from "../services/scrum.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'scrum-main',
    templateUrl: './src/modules/scrum/templates/scrummain.html',
    providers: [scrum]
})
export class ScrumMain {

    constructor(private scrum: scrum, private modellist: modellist, private language: language) {
        this.loadList();
    }

    /**
     * load the list data
     */
    private loadList() {
        this.modellist.getListData();
    }

    /**
     * getter for the text
     */
    get text() {
        return this.language.getLabel('LBL_SELECT_THEME');
    }
}

