/**
 * @module ObjectComponents
 */
import {Component, OnInit, SkipSelf} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modelutilities} from "../../../services/modelutilities.service";

@Component({
    selector: "bonus-cards-new-button",
    templateUrl: "./src/modules/bonusprograms/templates/bonuscardnewbutton.html",
    providers: [model]
})
export class BonusCardNewButton implements OnInit {

    /**
     * set to true to disabled the button .. based on the ACL Check fdor the model
     */
    public disabled: boolean = true;

    constructor(public language: language,
                public metadata: metadata,
                public modal: modal,
                public toast: toast,
                public backend: backend,
                public model: model,
                @SkipSelf() public parentModel: model,
                public modelUtilities: modelutilities) {

    }

    /**
     * prompt to select a program and then open the add modal.
     */
    public async execute() {

        let program;

        if (this.parentModel.module == 'BonusPrograms' && this.parentModel.id) {
            program = {
                id: this.parentModel.id,
                name: this.parentModel.data.summary_text
            };
        } else {
            program = await this.promptProgramSelection();
        }

        const dates: {date_start: string, date_end: string} = await this.backend.getRequest(`module/BonusCards/program/${program.id}/validitydates`).toPromise();

        this.addNew({...program, ...dates});

    }

    /**
     * set disabled from acl
     */
    public ngOnInit() {
        this.model.module = 'BonusCards';
        if (this.metadata.checkModuleAcl(this.model.module, "create")) {
            this.disabled = false;
        }
    }

    /**
     * prompt to select a program and then open the add modal.
     */
    private async promptProgramSelection(): Promise<{ id: string, name: string }> {

        const params = {
            start: 0,
            limit: 1000
        };
        const sortArray = [{
            sortfield: 'last_run_date',
            sortdirection: 'DESC'
        }];

        const programs: { list, object } = await this.backend.getList('BonusPrograms', sortArray, params).toPromise() as any;

        if (!programs?.list || programs.list.length === 0) {
            this.toast.sendToast('LBL_NO_PROGRAMS_FOUND', 'warning');
            return undefined;
        }

        const options = programs.list.map(item => ({value: item.id, display: item.summary_text}));

        const programId: string | false = await this.modal.prompt('input', 'MSG_SELECT_PROGRAM', 'LBL_BONUSCARD', 'shade', null, options, true).toPromise();

        if (!programId) return undefined;

        return {
            id: programId,
            name: options.find(o => o.value == programId).display
        };
    }

    /**
     * add a new card with the program
     */
    public addNew(program: { id: string, name: string, purchase_date: string, valid_until: string }) {
        this.model.id = undefined;
        this.model.initialize();
        let presets;

        if (!!program) {
            presets = {
                bonusprogram_id: program.id,
                bonusprogram_name: program.name,
                purchase_date: this.modelUtilities.backend2spice(this.model.module, 'purchase_date', program.purchase_date),
                valid_until: this.modelUtilities.backend2spice(this.model.module, 'valid_until', program.valid_until),
            };
        }

        this.model.addModel('', this.parentModel, presets);
    }
}
