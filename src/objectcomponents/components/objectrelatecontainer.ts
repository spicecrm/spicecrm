import {
    AfterViewInit, Component, ViewChild, ViewContainerRef, OnDestroy, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-tab-container',
    templateUrl: './src/objectcomponents/templates/objectrelatecontainer.html'
})
export class ObjectRelateContainer implements OnInit {

    private componentconfig: any = {};
    private componentset: string;

    constructor(private model: model, private metadata: metadata) {
    }

    public ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('ObjectRelateContainer', this.model.module);
        this.componentset = componentconfig.componentset;
    }
}
