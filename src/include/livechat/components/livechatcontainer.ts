/**
 * @module ModuleLiveChat
 */
import {
    Component, Input,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'livechat-container',
    templateUrl: '../templates/livechatcontainer.html',
    standalone: false
})
export class LiveChatContainer {

    /**
     * the componentset id to render
     */
    public componentset: string = '';

    constructor(public model: model, public metadata: metadata) {
        let componentconfig = this.metadata.getComponentConfig('LiveChatContainer', this.model.module);
        this.componentset = (componentconfig.componentset ? componentconfig.componentset : this.componentset);
    }



}
