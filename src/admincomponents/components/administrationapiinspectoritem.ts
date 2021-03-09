import {Component, OnInit, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';
import {classNames} from "@angular/cdk/schematics";
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";

@Component({
    selector: '[administration-api-inspector-item]',
    templateUrl: './src/admincomponents/templates/administrationapiinspectoritem.html',
    providers:[administrationapiinspectorService]
})

class AdmininstrationApiInspectorItem{

}