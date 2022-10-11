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
import {DeploymentSystemValidationField} from "./components/deploymentsystemvalidationfield";
import {DeploymentSystemAddRelatedButton} from "./components/deploymentsystemaddrelatedbutton";
import {DeploymentSystemSelectRelatedButton} from "./components/deploymentsystemselectrelatedbutton";
import {DeploymentFetchPackagesButton} from "./components/deploymentsystemfetchpackagesbutton";
import {DeploymentSystemPackagesModal} from "./components/deploymentsystempackagesmodal";
import {DeploymentSystemLandscapeView} from "./components/deploymentsystemlandscapeview";
import {DirectivesModule} from "../../directives/directives";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {DeploymentSystemPackagesCockpitView} from "./components/deploymentsystempackagescockpitview";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        DragDropModule
    ],
    declarations: [
        DeploymentSystemPackagesCockpitView,
        DeploymentSystemLandscapeView,
        DeploymentSystemPackagesModal,
        DeploymentFetchPackagesButton,
        DeploymentSystemSelectRelatedButton,
        DeploymentSystemAddRelatedButton,
        DeploymentSystemValidationField,
        DeploymentCRDBEntries,
        DeploymentCRSetActiveButton,
        DeploymentCRActive,
        DeploymentCRDBSQL
    ]
})
export class ModuleDeployment {}
