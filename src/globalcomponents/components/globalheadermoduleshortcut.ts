/**
 * @module GlobalComponents
 */
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";

/**
 * renders a componentn in the global toolbar on top to display if a cr is active
 */
@Component({
    selector: 'global-header-module-shortcut',
    templateUrl: "../templates/globalheadermoduleshortcut.html",
    standalone: false
})
export class GlobalHeaderModuleShortcut implements OnInit {

    public componentconfig: any = {};
    public moduledefs: any = {};

    constructor(public language: language,
                public metadata: metadata,
                public router: Router) {
    }

    get module(){
        return this?.componentconfig?.module ?? '';
    }

    get moduleNameTranslated(){
        return this.language.getModuleName(this?.componentconfig?.module ?? '');
    }

    get hasAccess() {
        if(!this.componentconfig) return false;
        return this.metadata.checkModuleAcl(this.module,'list');
    }

    public ngOnInit() {
        this.loadConfig();
    }

    public loadConfig(){
        this.moduledefs = this.metadata.getModuleDefs(this.componentconfig.module);
    }


    /**
     * navigates to the module
     */
    public goTo() {
        this.router.navigate(["/module/" + this.componentconfig.module]);
    }
}
