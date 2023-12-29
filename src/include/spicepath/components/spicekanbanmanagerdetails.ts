import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
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
    private _selectedStage: any;

    /**
     * system languages array
     */
    public systemLanguages: any[] = [];

    /**
     * holds spice text
     */
    public selectedSpiceText: any = {id: '', name: '', parent_id: '', parent_type: '', text_id: '', text_language: '', label: '', deleted: 0 | 1};

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

    @Input()
    set selectedStage(stage) {
        this._selectedStage = stage;
        this.selectSpiceText();
    }

    get selectedStage() {
        return this._selectedStage;
    }

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
        this.selectSpiceText();
    }

    /**
     * determines spice text for current tab
     */
    public selectSpiceText(): {} {
        // reset cached spice text
        this.selectedSpiceText = {id: '', name: '', parent_id: '', parent_type: '', text_id: '', text_language: '', label: '', deleted: 0};

        // get spice text by language
        const selectedSpiceText = this.kanban.currentBeanGuideSpiceTexts.find((text) => text.text_language == this.activeTab && text.parent_id == this.selectedStage.id);

        if(!selectedSpiceText) return this.selectedSpiceText;

        return this.selectedSpiceText = selectedSpiceText;
    }

}

