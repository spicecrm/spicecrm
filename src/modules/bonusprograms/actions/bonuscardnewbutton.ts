/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

/** @ignore */
declare var moment;

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

        let dates: { date_start: string, date_end: string } = await this.backend.getRequest(`module/BonusCards/program/${program.id}/validitydates`)
            .toPromise()
            .catch(() =>
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'))
            );

        if (!dates) dates = {date_start: new moment(), date_end: new moment().add(1, 'years')};

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
     * add a new card with the program
     */
    public addNew(program: { id: string, name: string, date_start: string, date_end: string }) {
        this.model.id = undefined;
        this.model.initialize();
        let presets;

        if (!!program) {
            presets = {
                bonusprogram_id: program.id,
                bonusprogram_name: program.name,
                purchase_date: this.modelUtilities.backend2spice(this.model.module, 'purchase_date', program.date_start),
                valid_until: this.modelUtilities.backend2spice(this.model.module, 'valid_until', program.date_end),
            };
        }

        this.model.addModel('', this.parentModel, presets);
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

        const programs: { list, object } = await this.backend.getList('BonusPrograms', sortArray, params).toPromise().catch(() =>
            this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'))
        ) as any;

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
}
