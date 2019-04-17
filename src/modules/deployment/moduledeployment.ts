/**
 * @module ModuleDeployment
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {VersionManagerService} from '../../services/versionmanager.service';

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';

import /*embed*/ {DeploymentCRDBEntries} from './components/deploymentcrdbentries';
import /*embed*/ {DeploymentCRSetActiveButton} from './components/deploymentcrsetactivebutton';
import /*embed*/ {DeploymentCRActive} from './components/deploymentcractive';
import /*embed*/ {DeploymentCRDBSQL} from './components/deploymentcrdbsql';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
    ],
    declarations: [
        DeploymentCRDBEntries,
        DeploymentCRSetActiveButton,
        DeploymentCRActive,
        DeploymentCRDBSQL
    ]
})
export class ModuleDeployment {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}