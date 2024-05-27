/**
 * @module ModuleUsers
 */
import {
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
    OnInit,
    SkipSelf,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {Observable, Subject} from "rxjs";
import {metadata} from "../../../services/metadata.service";
import {configurationService} from "../../../services/configuration.service";
import {helper} from '../../../services/helper.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "user-create-roles",
    templateUrl: "../templates/usercreateroles.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UserCreateRoles),
            multi: true
        }
    ]
})
export class UserCreateRoles implements OnInit, ControlValueAccessor {

    /**
     * teh user Roles
     */
    public availableRoles: any[] = [];
    public userRoles: any[] = [];

    /**
     * for the control accessor
     */
    public onChange: (value: string[]) => void;
    public onTouched: () => void;

    @Input() scopefilter: 'i'|'e';

    constructor(
        public model: model,
        public modelutilities: modelutilities,
        public backend: backend,
        public metadata: metadata
    ) {

    }

    public ngOnInit() {
        this.getRoles();
    }

    // ControlValueAccessor Interface: >>
    public registerOnChange(fn: any): void {
        this.onChange = (val) => {
            fn(val);
        };
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        if ( value === undefined ) return;
        this.userRoles = value;
    }

    public getRoles(){
        this.backend.getRequest('configuration/spiceui/core/roles/' + this.model.id).subscribe(res => {
            this.availableRoles = res.allRoles.filter(r => r.rolescope == 'a' || (this.scopefilter && r.rolescope == this.scopefilter));
        });
    }

    get defaultRole(){
        let dr = this.userRoles.find(r => r.default);
        return dr ? dr.id : '';
    }

    set defaultRole(id){
        if(this.defaultRole) this.userRoles.find(r => r.default).default = false;
        this.userRoles.find(r => r.id == id).default = true;
    }

    /**
     * returns if a role is checked
     * @param id
     */
    public roleChecked(id){
        return this.userRoles.findIndex(r => r.id == id) >= 0;
    }

    /**
     * checkes a role
     * @param id
     */
    public checkRole(id){
        let index = this.userRoles.findIndex(r => r.id == id);
        if(index >= 0){
            this.userRoles.splice(index, 1);
        } else {
            this.userRoles.push({id: id, default: false});
        }

        // unset the default role and set to the first if one remains
        if(!this.defaultRole && this.userRoles.length > 0) this.userRoles[0].default = true;

        // emit the changes
        this.onChange(this.userRoles);
    }

}
