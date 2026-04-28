import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {AIPrompt} from "../../extensions/include/generativeai/interfaces/generativeai.interfaces";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {view} from "../../services/view.service";
import {forkJoin} from "rxjs";

@Component({
    selector: 'workbench-config-option-aiprompt',
    templateUrl: '../templates/workbenchconfigoptionaiprompt.html',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkbenchConfigOptionAiprompt implements OnInit {

    public configValues: any = [];
    public option: any = {};
    public disabled: boolean = false;
    public module: string;

    public globalPrompts = signal<AIPrompt[] | null>(null);
    public customPrompts = signal<AIPrompt[] | null>(null);
    constructor(
        public backend: backend,
        public language: language,
        public view: view
    ) {
    }

    public ngOnInit() {
        this.setAIPrompts();
    }

    /**
     * set module AIPrompts
     */
    public setAIPrompts() {
        forkJoin({
            global: this.backend.getRequest('configuration/configurator/entries/sysaiprompts'),
            custom: this.backend.getRequest('configuration/configurator/entries/syscustomaiprompts')
        }).subscribe(({global, custom}) => {
            this.globalPrompts.set((global || []).map((p:any) => ({ ...p, scope: 'g'})));
            this.customPrompts.set((custom || []).map((p:any) => ({ ...p, scope: 'c'})));
        })
    }
}