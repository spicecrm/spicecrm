/**
 * @module ModuleActivities
 */
import {Component, OnDestroy, OnInit, SkipSelf, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";

/**
 * renders a modal to generate tasks wit AI
 */
@Component({
    selector: 'action-generate-tasks-modal',
    templateUrl: '../templates/actiongeneratetasksmodal.html',
    standalone: false
})
export class ActionGenerateTasksModal implements OnInit{

    public self: any;

    public thinking: boolean = true;

    public tasks: any[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        @SkipSelf() public parent: model,
        public modal: modal,
        public backend: backend
    ) {

    }

    public ngOnInit() {
        let thinkingModal = this.modal.await('LBL_THINKING');
        this.backend.getRequest(`modules/Tasks/generate/${this.parent.module}/${this.parent.id}`).subscribe({
            next: (res) => {
                this.tasks = res.tasks;
                this.thinking = false;
                thinkingModal.emit(true);
            },
            error: (e) => {
                thinkingModal.emit(true);
                this.close();
            }
        })
    }

    public close(){
        this.self.destroy();
    }
}
