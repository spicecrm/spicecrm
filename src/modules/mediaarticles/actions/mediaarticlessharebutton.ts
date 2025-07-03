import {Component, inject, Injector, OnInit} from '@angular/core';
import {ObjectActionSetItemBase} from "../../../objectcomponents/interfaces/objectactionsetitembase";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {MediaArticlesShareModal} from "../components/mediaarticlessharemodal";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: 'media-articles-share-button',
    template: '<system-label label="LBL_SHARE"/>',
    standalone: false
})
export class MediaArticlesShareButton extends ObjectActionSetItemBase implements OnInit {
    /**
     * acl action to execute
     */
    public aclAction = 'export';
    /**
     * acl action scope, either model or module
     */
    public aclActionScope: 'model' | 'module' = 'module';
    /**
     * reference to the backend service
     */
    public backend = inject(backend);
    /**
     * reference to the toast service
     */
    public toast = inject(toast);
    /**
     * reference to the modal service
     */
    public modal: modal = inject(modal);
    /**
     * reference to the injector of this component
     * @private
     */
    private injector: Injector = inject(Injector);
    /**
     * reference to the configuration service
     * @private
     */
    private configurationService = inject(configurationService);

    public ngOnInit() {
        this.hidden = window._.isEmpty(this.configurationService.getCapabilityConfig('mediaarticles')?.channels);
    }

    /**
     * open the share modal
     */
    public execute() {
        this.modal.openStaticModal(MediaArticlesShareModal, true, this.injector);
    }
}