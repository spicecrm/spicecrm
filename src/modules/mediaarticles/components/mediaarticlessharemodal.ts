import {Component, ComponentRef, OnInit} from '@angular/core';
import {ModalComponentI} from "../../../objectcomponents/interfaces/objectcomponents.interfaces";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {configurationService} from "../../../services/configuration.service";
import {model} from "../../../services/model.service";
import {MediaFileI} from "../interfaces/mediaarticles.interfaces";
import {helper} from "../../../services/helper.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {modal} from "../../../services/modal.service";
import moment from "moment";
import {broadcast} from "../../../services/broadcast.service";

@Component({
    selector: 'media-articles-share-modal',
    templateUrl: '../templates/mediaarticlessharemodal.html',
    providers: [relatedmodels],
    standalone: false
})
export class MediaArticlesShareModal implements ModalComponentI, OnInit {
    /**
     * reference to this component
     */
    public self: ComponentRef<this>;
    /**
     * holds the available APIs
     */
    public availableChannels: {id: string, name: string}[] = [];
    /**
     * text field to share
     */
    public textField: string;
    /**
     * flag to publish now or plan
     */
    public publishNow: boolean = true;
    /**
     * text field to share
     */
    public plannedPublishDate: moment.Moment;
    /**
     * social media channels ids to share
     */
    public selectedChannels: string[] = [];
    /**
     * related media files list
     */
    public mediaFiles: MediaFileI[] = [];
    /**
     * holds the text field display content
     */
    public textFieldDisplay: string;

    constructor(private backend: backend,
                private toast: toast,
                private helper: helper,
                public model: model,
                public relatedModels: relatedmodels,
                private modal: modal,
                private broadcast: broadcast,
                private configurationService: configurationService) {
    }

    public ngOnInit() {
        this.availableChannels = this.configurationService.getCapabilityConfig('mediaarticles').channels;
        this.setMediaFiles();
    }

    /**
     * set the media files list
     *
     * @private
     */
    private setMediaFiles() {

        const setFunction = mediaFiles => {
            this.mediaFiles = mediaFiles;
            this.mediaFiles.forEach(f => {
                f.file_size_readable = this.helper.humanFileSize(f.filesize);
                f.thumbnail_file = `data:${f.filetype};base64,${f.thumbnail}`;
            })
        };

        setFunction(this.model.getRelatedRecords('mediafiles'));

        this.relatedModels.id = this.model.id;
        this.relatedModels.module = 'MediaArticles';
        this.relatedModels.model = this.model;
        this.relatedModels.loaditems = -1;
        this.relatedModels.relatedModule = 'MediaFiles';

        this.relatedModels.getData().subscribe(() => {
            setFunction(this.relatedModels.items);
        });
    }

    /**
     * set the text field display-content
     *
     * @param textField
     */
    public setTextFieldDisplay(textField: string) {
        const div = document.createElement('div');
        div.innerHTML = this.model.getFieldValue(textField);
        this.textFieldDisplay = div.innerText;
    }

    /**
     * send the share request to backend
     */
    public share() {

        const body = {
            textField: this.textField,
            mediaFilesIds: this.mediaFiles.filter(f => f.selected).map(f => f.id),
            channels: this.selectedChannels,
            plannedPublishDate: this.plannedPublishDate?.format('YYYY-MM-DD HH:mm:ss')
        };

        const isLoading = this.modal.await('LBL_PROCESSING');

        this.backend.postRequest(`module/MediaArticles/${this.model.id}/share`, null, body).subscribe({
            next: () => {
                isLoading.next(true);
                isLoading.complete();
                this.broadcast.broadcastMessage('relatedmodels.reload', {module: 'MediaArticleShares'});
                this.toast.sendToast('LBL_SUCCESS', 'success');
                this.close();
            },
            error: () => {
                isLoading.next(true);
                isLoading.complete();
                this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        });
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }
}