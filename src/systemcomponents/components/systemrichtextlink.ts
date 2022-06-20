import {Component, EventEmitter, Input, OnInit, SkipSelf} from '@angular/core';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {helper} from '../../services/helper.service';

@Component({
    templateUrl: '../templates/systemrichtextlink.html',
    providers: [model]
})
export class SystemRichTextLink implements OnInit {

    @Input() public url = ''; // The URL of the link.
    @Input() public text = ''; // The text of the link.
    @Input() public toTrack = false; // Should clicks on the link be trackable?
    @Input() public trackingId = '';
    @Input() public parent: model;
    // @Input() public generateShortUrl = false;

    /**
     * The error text for the URL field.
     */
    public errorLabel = '';

    /**
     * Indicates that the form currently can get submitted.
     */
    public canSubmit = false;

    /**
     * The mode: Add a new or edit an existing link.
     */
    public alterMode: false;

    /**
     * Keep the link text in sync with the link URL while editing the URL?
     */
    public textIsUrl = false;

    /**
     * Event emitter to emit the form data.
     */
    public response: EventEmitter<any>;

    public self: any;

    constructor(public language: language, public helper: helper, private model: model) {
        this.response = new EventEmitter<any>(); // Create the event emitter for emitting the form input.
    }

    public ngOnInit() {
        this.url = this.url.trim(); // Trim spaces from URL if present.
        this.text = this.text.trim(); // Trim spaces from link text if present.
        if ( !this.urlHasProtocol( this.url ) ) this.url = 'https://'; // Start the URL with "https://" in case there isn´t already a protocol.
        this.textIsUrl = !this.text; // In case there is no link text given, the link text
        this.toTrack = !!this.trackingId;
        if ( this.url ) this.url = this.url.trim();
    }

    /**
     * Check if the URL has a protocol at the beginning.
     */
    public urlHasProtocol( url: string ): boolean {
        return /^[a-zA-Z]+\:\/\//.test(url.trim());
    }

    /**
     * Check the validity of a URL.
     */
    public urlIsValid( url: string ): boolean {
        return /^[a-zA-Z]+\:\/\/.+/.test(url.trim());
    }

    /**
     * Check existence and validity of the URL and set the error text if necessary.
     */
    public checkUrl(): boolean {
        let urlTrimmed = this.url.trim();
        if ( !urlTrimmed ) {
            this.errorLabel = 'MSG_INPUT_REQUIRED';
        } else if ( !this.urlIsValid( urlTrimmed )) {
            this.errorLabel = 'LBL_INPUT_INVALID';
        } else {
            this.errorLabel = '';
        }
        if ( this.textIsUrl ) this.text = this.url;
        return !this.errorLabel;
    }

    /**
     * After leaving the text field:
     * Got the link text changed? Then stop keeping the link text in sync with the link URL while editing the URL.
     */
    public changeTextIsUrl() {
        if ( !this.text ) this.textIsUrl = true;
        else {
            if ( this.url != this.text ) this.textIsUrl = false;
        }
    }

    /**
     * Submit the form and close the modal.
     */
    public submit() {
        if ( !this.checkUrl() ) return;
        if (this.toTrack) {
            if ( !this.trackingId ) {
                this.trackingId = this.helper.generateGuid();
                this.saveTrackingLink();
            }
        } else delete this.trackingId;
        let responseObject = {
            url: this.url.trim(),
            toTrack: this.toTrack,
            trackingId: this.trackingId,
            text: undefined as string
        };
        if ( !this.alterMode ) responseObject.text = this.text.trim();
        this.response.emit( responseObject );
        this.self.destroy(); // close the modal
    }

    /**
     * Cancel adding/editing a link and close the modal.
     */
    public cancel() {
        this.response.emit(null);
        this.self.destroy(); // close the modal
    }

    /**
     * */
    private saveTrackingLink() {
        this.model.id = this.trackingId;
        this.model.module = 'TrackingLinks';
        this.model.setFields({
            name: this.text,
            url: this.url,
            parent_type: this.parent.module,
            parent_id: this.parent.id
        });
        this.model.save();
    }

}
