/**
 * @module ModuleScrum
 */
import {Component, EventEmitter, OnChanges, OnDestroy, Output} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {scrumtree} from "../services/scrum.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'scrum-main',
    templateUrl: './src/modules/scrum/templates/scrummain.html',
    providers: [scrumtree]
})
export class ScrumMain {

    constructor(private scrum: scrumtree, private metadata: metadata, private modellist: modellist, private language: language) {
        this.loadList();
    }

    /**
     * load the list data
     */
    private loadList() {
        this.modellist.getListData();
    }

    get text() {
        return this.language.getLabel('LBL_SELECT_THEME');
    }
}

