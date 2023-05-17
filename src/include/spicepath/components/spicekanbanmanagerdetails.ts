import {Component, ComponentRef, Input, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {SystemTextConfiguratorModal} from "./systemtextconfiguratormodal";

@Component({
    selector: 'spice-kanban-manager-details',
    templateUrl: '../templates/spicekanbanmanagerdetails.html'
})

export class SpiceKanbanManagerDetails implements OnInit {

    @Input() public selectedStage: any;
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

    /**
     * public
     */
    public loading: boolean = false;

    /**
     * whether the systext is set for this domain
     */
    public hasSysText: boolean = false;

    /**
     * holds text_id value, max. 36 characters & must be unique
     * i.e. pg-000-001
     */
    public textId: string;

    constructor (
        public language: language,
        public modal: modal,
        public toast: toast
    ) { }

    public ngOnInit() {
        // commented out for later use
        // this.textId = this.kanbanservice.spicebeanguide.text_id;


        // get languages
        this.systemLanguages = this.language.getAvialableLanguages();
        this.activeTab = this.language.currentlanguage;
    }

    /**
     * opens modal
     * returns text_id from the backend
     */
    public addSysTextId() {
        this.loading = true;

        this.modal.openModal('SystemTextConfiguratorModal', true).subscribe( (modalRef: ComponentRef<SystemTextConfiguratorModal>) => {
            modalRef.instance.answer.subscribe(textId => {
                this.textId = textId;
            })
        });
    }

    /**
     * changes the current tab
     * @param langTab string
     */
    public switchTab(langTab: string) {
        this.activeTab = langTab;
    }

}

