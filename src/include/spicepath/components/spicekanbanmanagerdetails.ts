import {Component, Input, KeyValueDiffer, KeyValueDiffers, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {KanbanManagerService} from "../services/kanbanmanager.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {SpiceBeanGuideStageI, SpiceTextsI} from "../interfaces/kanbanmanager.interfaces";

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
    public selectedStageText: SpiceTextsI;

    /**
     * holds active tab instance
     */
    public selectedLanguage: string = '';

    constructor(
        public kanban: KanbanManagerService,
        public language: language,
        public modal: modal,
        public toast: toast,
        public utils: modelutilities,
    ) {
    }

    @Input()
    set selectedStage(stage: SpiceBeanGuideStageI) {

        this._selectedStage = stage;

        if (stage) {
            this._selectedStage = this.kanban.generateTrackableObject(stage, 'stages');
            this.selectSpiceText();
        }
    }

    get selectedStage(): SpiceBeanGuideStageI {
        return this._selectedStage;
    }

    public ngOnInit() {
        // get languages
        this.systemLanguages = this.language.getAvialableLanguages();
        this.selectedLanguage = this.language.currentlanguage;
    }

    /**
     * changes the current tab
     * @param langTab string
     */
    public switchTab(langTab: string) {
        this.selectedLanguage = langTab;
        this.selectSpiceText();
    }

    /**
     * determines spice text for current tab
     */
    public selectSpiceText() {

        // get spice text by language
        const selectedSpiceText: SpiceTextsI = this.kanban.currentStageTexts.find((text) => text.text_language == this.selectedLanguage && text.parent_id == this._selectedStage.id);

        if (!!selectedSpiceText) {
            this.selectedStageText = this.kanban.generateTrackableObject(selectedSpiceText, 'spiceTexts');
        } else {
            const validator = obj => !!obj.name;
            const newText = this.generateSpiceTextObject();
            this.selectedStageText = this.kanban.generateTrackableNewObject(newText, 'spiceTexts', validator);
            this.kanban.currentStageTexts.push(newText);
        }
    }

    /**
     * generate data details for a new SpiceText
     * @private
     */
    private generateSpiceTextObject(): SpiceTextsI {

        return {
            id: this.utils.generateGuid(),
            description: '',
            parent_id: this._selectedStage.id,
            parent_type: 'SpiceBeanGuideStages',
            text_id: this.kanban.selectedBeanGuide.systextid,
            text_language: this.selectedLanguage,
            deleted: 0
        };
    }
}

