import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";

@Component({
    selector: 'spice-kanban-manager-details',
    templateUrl: '../templates/spicekanbanmanagerdetails.html'
})

export class SpiceKanbanManagerDetails implements OnInit {

    /**
     * holds label from sysdomainfieldvalidationvalues table
     */
    public domainLabel: string = 'LBL_LABEL';

    /**
     * holds value for the field stage_add_data
     * i.e. {probability: 60}
     */
    public stageAddData: string = '{probability: 60}';

    /**
     * holds component id of the stage description
     */
    public stageComponentset: string = '11111111-4ee2-ee9e-8b5d-5d08b77e1285';

    /**
     * system languages array
     */
    public systemLanguages: any[] = [];

    /**
     * holds spice text
     */
    public spiceText: string = 'blabla bla';

    /**
     * holds active tab instance
     */
    public activeTab: string = '';

    constructor(
        public language: language,
    ) {

    }

    public ngOnInit() {

        // get all languages of the system
        this.systemLanguages = this.language.languagedata.languages.available;

        // set active user language in the tab
        this.activeTab = this.language.languagedata.language;
    }

    /**
     * connects label with spice text
     */
    public addSpiceText(e) {
        console.log(e);
        console.log('clicked');
        // what happens now?
        // open a modal ? the label is already copied & displayed
        // for this label, you can add a spice text in each language
    }

    /**
     * changes the current tab
     * @param langTab string
     */
    public switchTab(langTab: string) {
        this.activeTab = langTab;
    }

}

