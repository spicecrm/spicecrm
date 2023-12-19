import {Component, Input, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {KanbanManagerService} from "../services/kanbanmanager.service";

/**
 * manages the details of the kanban
 * i.d. componentset, spicetext in available languages etc.
 */
@Component({
    selector: 'spice-kanban-manager-details',
    templateUrl: '../templates/spicekanbanmanagerdetails.html'
})

export class SpiceKanbanManagerDetails implements OnInit {

    /**
     * selected stage
     */
    @Input() public selectedStage: any;

    /**
     * system languages array
     */
    public systemLanguages: any[] = [];

    /**
     * holds spice text
     */
    public spiceText: any = {id: '', name: '', parent_id: '', parent_type: '', text_id: '', text_language: '', label: '', deleted: 0 | 1};

    /**
     * holds active tab instance
     */
    public activeTab: string = '';

    constructor (
        public language: language,
        public modal: modal,
        public toast: toast,
        public kanban: KanbanManagerService,
    ) { }

    public ngOnInit() {
        // get languages
        this.systemLanguages = this.language.getAvialableLanguages();
        this.activeTab = this.language.currentlanguage;

        this.displaySpiceText();
    }

    /**
     * changes the current tab
     * @param langTab string
     */
    public switchTab(langTab: string) {
        this.activeTab = langTab;
        this.displaySpiceText();
    }

    /**
     * determines spice text for current tab
     */
    public displaySpiceText(): {} {
        // reset cached spice text
        this.spiceText = {id: '', name: '', parent_id: '', parent_type: '', text_id: '', text_language: '', label: '', deleted: 0};

        // get spice text by language
        const selectedSpiceText = this.kanban.currentSpiceTexts.find((text) => text.text_language == this.activeTab);

        if(!selectedSpiceText) return this.spiceText;

        return this.spiceText = selectedSpiceText;
    }

}

