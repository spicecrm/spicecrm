/**
 * @module AdminComponentsModule
 */
import {Component} from "@angular/core";
import {VersionManagerService} from "../../services/versionmanager.service";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: 'version-controller',
    templateUrl: './src/admincomponents/templates/versioncontroller.html'
})
export class VersionControllerComponent
{
    constructor(
        private metadata: metadata,
        private vms:VersionManagerService,
    ) {

    }

    get module_versions()
    {
        return this.vms.module_versions;
    }

    get modules()
    {
        return this.metadata.getAppModules();
    }
}