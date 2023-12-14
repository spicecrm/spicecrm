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
    public spiceText: string = '';

    /**
     * holds active tab instance
     */
    public activeTab: string = '';

    constructor (
        public language: language,
        public modal: modal,
        public toast: toast,
        public kanban: KanbanManagerService
    ) { }

    public ngOnInit() {
        // get languages
        this.systemLanguages = this.language.getAvialableLanguages();
        this.activeTab = this.language.currentlanguage;

    }

    /**
     * changes the current tab
     * @param langTab string
     */
    public switchTab(langTab: string) {
        this.activeTab = langTab;
    }

}

