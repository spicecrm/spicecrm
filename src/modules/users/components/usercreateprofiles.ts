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
    selector: "user-create-profiles",
    templateUrl: "../templates/usercreateprofiles.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UserCreateProfiles),
            multi: true
        }
    ]
})
export class UserCreateProfiles implements OnInit, ControlValueAccessor {

    public availableProfiles: any[] = [];
    public userProfiles: any[] = [];

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
        this.getACLProfiles();
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
        this.userProfiles = value;
    }

    public getACLProfiles(){
        this.backend.getRequest('module/SpiceACLProfiles', {limit: -99}).subscribe({
            next: (aclProfiles) => {
                this.availableProfiles = aclProfiles.list.filter(p => p.spiceaclprofilescope == 'a' || (this.scopefilter && p.spiceaclprofilescope == this.scopefilter)).sort((a, b) => a.name.localeCompare(b.name));
            }
        })
    }

    /**
     * returns if a profile is checked
     * @param id
     */
    public profileChecked(id){
        return this.userProfiles.indexOf(id) >= 0;
    }

    /**
     * checkes a profile
     * @param id
     */
    public checkProfile(id){
        let index = this.userProfiles.indexOf(id);
        if(index >= 0){
            this.userProfiles.splice(index, 1);
        } else {
            this.userProfiles.push(id);
        }

        this.onChange(this.userProfiles);
    }


}
