import {Component, OnInit, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';
import {classNames} from "@angular/cdk/schematics";
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";

@Component({
    selector: '[administration-api-inspector-tree]',
    templateUrl: './src/admincomponents/templates/administrationapiinspectortree.html',
    providers:[administrationapiinspectorService]
})

class AdministrationApiInspectorTree{

}