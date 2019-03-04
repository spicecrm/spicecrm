/**
 * @module WorkbenchModule
 */
import {
    Component,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {AppDataService} from "../../services/appdata.service";

@Component({
    templateUrl: './src/workbench/templates/validationrulesmanager.html',
})
export class ValidationRulesManager
{
    rules: Array<any> = [];
    private _backup_rules: Array<any> = [];
    private _current_module: string;
    private _current_rule: string;
    private _current_rule_data: any = {};
    logicoperator_options = [];
    current_tab = 'details';

    constructor(
        private appdata: AppDataService,
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private utils: modelutilities,
        private toast: toast,
    ) {
        //this.current_module = 'Opportunities';
        this.logicoperator_options = this.language.getDisplayOptions('logicoperators_dom', true);
    }

    get modules() {
        return this.appdata.modules;
    }

    set current_module(val: string) {
        this._current_module = val;
        this.rules = this.metadata.getModuleValidations(val);
        this.copyRulesToBackup();
        this.current_rule = null;
    }

    get current_module() {
        return this._current_module;
    }

    set current_rule(val: string) {
        this._current_rule = val;
        this._current_rule_data = this.getCurrentRuleData();
    }

    get current_rule_data() {
        return this._current_rule_data;
    }

    get current_rule() {
        return this._current_rule;
    }

    getCurrentRuleData() {
        if (this.rules)
            return this.rules.find((e) => {
                return e.id == this._current_rule
            });
        else
            return '';
    }

    removeCurrentValidationRule() {
        this.backend.deleteRequest('spiceui/core/modelvalidations/' + this.current_rule).subscribe(
            (success) => {
                //this.broadcast.broadcastMessage('metadata.updatefieldsets', data);
                this.toast.sendToast('rule removed');
                this.removeRule(this.current_rule);
                return true;
            },
            (error) => {
                this.toast.sendToast('removing rule failed!');
                console.error(error);
                return false;
            }
        );
    }

    save() {
        let data = this.current_rule_data;
        this.backend.postRequest('spiceui/core/modelvalidations', {}, data).subscribe(
            (success) => {
                this.current_rule_data._is_new_record = false;

                let idx = this._backup_rules.findIndex((e) => {
                    return e.id == this._current_rule
                });
                this._backup_rules[idx] = {...data};

                this.toast.sendToast('changes saved');
            },
            (error) => {
                this.toast.sendAlert('saving changes failed!');
                console.error(error);
            }
        );
    }

    cancel() {
        if (this.current_rule_data._is_new_record) {
            // remove it...
            this.removeRule(this.current_rule);
        }
        else {
            // reset changes...
            this.resetCurrentRuleData();
        }
    }

    addValidationRule() {
        this.rules.push({
            id: this.utils.generateGuid(),
            module: this.current_module,
            active: 1,
            actions: [],
            conditions: [],
            _is_new_record: true,
        });
        this.current_rule = this.rules[this.rules.length - 1].id;
    }

    private removeRule(id: string = this.current_rule): boolean {
        let idx = this.rules.findIndex((e) => {
            return e.id == id
        });
        this.rules.splice(idx, 1);
        if (this.current_rule == id) {
            this.current_rule = null;
        }
        return true;
    }

    private resetCurrentRuleData() {
        let data = this._backup_rules.find((e) => {
            return e.id == this._current_rule
        });
        this._current_rule_data = {...data};
        console.log('resetted to', data, this._backup_rules);
    }

    private copyRulesToBackup() {
        this._backup_rules = [];
        for (let r of this.rules) {
            this._backup_rules.push({...r});
        }
    }
}


import {Pipe} from '@angular/core';
import {JsonPipe} from '@angular/common';

@Pipe({name: 'maybejson'})
export class MaybeJsonPipe extends JsonPipe {
    transform(value): string {
        if (value instanceof Array || value instanceof Object) {
            return super.transform(value);
        }
        else {
            return value;
        }
    }
}