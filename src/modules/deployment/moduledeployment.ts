/**
 * @module ModuleDeployment
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';

import {DeploymentCRDBEntries} from './components/deploymentcrdbentries';
import {DeploymentCRSetActiveButton} from './components/deploymentcrsetactivebutton';
import {DeploymentCRActive} from './components/deploymentcractive';
import {DeploymentCRDBSQL} from './components/deploymentcrdbsql';


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
export class ModuleDeployment {}
