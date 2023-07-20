import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {systemrichtextservice} from '../services/systemrichtext.service';
import {modal} from "../../services/modal.service";
import {Subject} from "rxjs";
import {backend} from "../../services/backend.service";

@Component({
    templateUrl: '../templates/systemrichtextlink.html',
    providers: [model]
})
export class SystemRichTextLink implements OnInit {

    @Input() public url = ''; // The URL of the link.
    @Input() public text = ''; // The text of the link.
    @Input() public toTrack = false; // Should clicks on the link be trackable?
    @Input() public marketingAction = '';
    @Input() public trackingId = '';
    @Input() public parent: model;

    /**
     * The error text for the URL field.
     */
    public urlErrorLabel = '';

    /**
     * The error text for the marketing action.
     */
    public marketingActionErrorLabel = '';

    /**
     * Indicates that the form currently can get submitted.
     */
    public canSubmit = false;

    /**
     * The mode: Add a new or edit an existing link.
     */
    public alterMode = false;

    /**
     * Keep the link text in sync with the link URL while editing the URL?
     */
    public textIsUrl = false;

    /**
     * Event emitter to emit the form data.
     */
    public response = new Subject<{
        url: string,
        trackByMethod: 'id' | 'url',
        trackingId: string,
        text: string,
        linkType: 'conv' | 'mark',
        marketingAction: string,
    }>();

    public self: any;

    public linkType: 'conv' | 'mark' = 'conv';

    public editorService: systemrichtextservice;
    /**
     * track by method for the radio buttons
     */
    public trackByMethod: 'id' | 'url';

    constructor(private model: model,
                private backend: backend,
                private modal: modal) {
    }

    /**
     * set the track by method and open selection modal on id method
     * @param value
     */
    public setTrackByMethod(value: 'id' | 'url') {
        this.trackByMethod = value;

        if (value == 'id') {
            this.openTrackingLinkSelectModal();
        } else {
            this.trackingId = undefined;
        }
    }

    /**
     * open tracking link selection modal
     */
    public openTrackingLinkSelectModal() {

        const options = [
            {value: 'select', display: 'LBL_SELECT'},
            {value: 'new', display: 'LBL_NEW'},
            {value: undefined, display: 'LBL_CANCEL'},
        ];

        this.modal.prompt('input', 'LBL_MAKE_SELECTION', 'LBL_TRACKINGLINKS', 'shade', 'select', options, 'button').subscribe(answer => {

            if (!answer) return;

            switch (answer) {
                case 'new':
                    const presets = {
                        name: this.text,
                        url: this.url
                    };
                    this.model.addModel('', null, presets, true).subscribe(res => {
                        this.trackingId = res.id;
                    });
                    break;
                case 'select':
                    this.modal.openModal('ObjectModalModuleLookup').subscribe((selectModal) => {
                        selectModal.instance.module = 'EmailTrackingLinks';
                        selectModal.instance.multiselect = false;
                        selectModal.instance.selectedItems.subscribe((items) => {
                            this.trackingId = items[0].id;
                        });
                    });
                    break;
            }
        });

    }

    public ngOnInit() {
        this.model.module = 'EmailTrackingLinks';
        this.url = this.url.trim(); // Trim spaces from URL if present.
        this.text = this.text.trim(); // Trim spaces from link text if present.
        if (!this.urlHasProtocol(this.url)) this.url = 'https://'; // Start the URL with "https://" in case there isn´t already a protocol.
        this.textIsUrl = !this.text; // In case there is no link text given, the link text
        if (this.url) this.url = this.url.trim();
        if (this.marketingAction) this.linkType = 'mark';
        this.loadMarketingActions();
    }

    /**
     * Check if the URL has a protocol at the beginning.
     */
    public urlHasProtocol(url: string): boolean {
        return /^[a-zA-Z]+\:\/\//.test(url.trim());
    }

    /**
     * Check the validity of a URL.
     */
    public urlIsValid(url: string): boolean {
        return /^[a-zA-Z]+\:\/\/.+/.test(url.trim());
    }

    /**
     * Check existence and validity of the URL and set the error text if necessary.
     */
    public checkUrl(): boolean {
        let urlTrimmed = this.url.trim();
        if (!urlTrimmed) {
            this.urlErrorLabel = 'MSG_INPUT_REQUIRED';
        } else if (!this.urlIsValid(urlTrimmed)) {
            this.urlErrorLabel = 'LBL_INPUT_INVALID';
        } else {
            this.urlErrorLabel = '';
        }
        if (this.textIsUrl) this.text = this.url;
        return !this.urlErrorLabel;
    }

    /**
     * Check existence of the marketing action and set the error text if necessary.
     */
    public checkMarketingAction(): boolean {
        if (!this.marketingAction) {
            this.marketingActionErrorLabel = 'MSG_INPUT_REQUIRED';
        } else {
            this.marketingActionErrorLabel = '';
        }
        return !this.marketingActionErrorLabel;
    }

    /**
     * After leaving the text field:
     * Got the link text changed? Then stop keeping the link text in sync with the link URL while editing the URL.
     */
    public changeTextIsUrl() {
        if (!this.text) this.textIsUrl = true;
        else {
            if (this.url != this.text) this.textIsUrl = false;
        }
    }

    /**
     * Submit the form and close the modal.
     */
    public submit() {
        if (this.linkType === 'conv' && !this.checkUrl()) return;
        if (this.linkType === 'mark' && !this.checkMarketingAction()) return;
        let responseObject = {
            url: this.linkType === 'conv' ? this.url.trim() : '',
            trackingId: this.linkType === 'conv' ? (this.trackingId ?? '') : undefined,
            text: undefined as string,
            linkType: this.linkType,
            trackByMethod: this.trackByMethod,
            marketingAction: this.linkType === 'mark' ? this.marketingAction : undefined
        };
        if (!this.alterMode) responseObject.text = this.text.trim();
        this.response.next(responseObject);
        this.response.complete();
        this.self.destroy(); // close the modal
    }

    /**
     * Cancel adding/editing a link and close the modal.
     */
    public cancel() {
        this.response.next(null);
        this.response.complete();
        this.self.destroy(); // close the modal
    }

    private loadMarketingActions() {
        this.editorService.loadMarketingActions();
    }

}
