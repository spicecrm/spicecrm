/**
 * @module SystemComponents
 */
import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {configurationService} from "../../services/configuration.service"

/**
 * a generic input that renders a select with the roles
 */
@Component({
    selector: "system-input-roles",
    templateUrl: "../templates/systeminputroles.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputRoles),
            multi: true
        }
    ]
})
export class SystemInputRoles implements ControlValueAccessor {

    public roles: any[] = [];

    public _role: {id: string, name: string};

    constructor(
        public language: language,
        public metadata: metadata,
        public configuration: configurationService
    ) {
        this.roles = this.configuration.getData('roles');
    }

    public onChange: (value: string) => void;
    public onTouched: () => void;

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {

        if (value) {
            this._role = {id: value, name: value};
            this.onChange(value);
        }
    }

    get role() {
        return this._role;
    }

    set role(role: {id: string, name: string}) {
        this._role = role;
        if (this.onChange) {
            this.onChange(role?.id);
        }
    }
}