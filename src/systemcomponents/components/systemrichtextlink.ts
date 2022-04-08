import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { language } from '../../services/language.service';

@Component({
    templateUrl: '../templates/systemrichtextlink.html',
})
export class SystemRichTextLink implements OnInit {

    @Input() public url = ''; // The URL of the link.
    @Input() public text = ''; // The text of the link.
    @Input() public toTrack = false; // Should clicks on the link be trackable?
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
    public addOrEdit: 'a'|'e';

    /**
     * Keep the link text in sync with the link URL while editing the URL?
     */
    public textIsUrl = false;

    /**
     * Event emitter to emit the form data.
     */
    public response: EventEmitter<any>;

    public self: any;

    constructor( public language: language ) {
        this.response = new EventEmitter<any>(); // Create the event emitter for emitting the form input.
    }

    public ngOnInit() {
        this.url = this.url.trim(); // Trim spaces from URL if present.
        this.text = this.text.trim(); // Trim spaces from link text if present.
        this.addOrEdit = this.url ? 'e':'a'; // The mode (edit or add) depends on whether a URL is initially given or not.
        if ( !this.urlHasProtocol( this.url ) ) this.url = 'https://'; // Start the URL with "https://" in case there isn´t already a protocol.
        this.textIsUrl = !this.text; // In case there is no link text given, the link text
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
    public checkUrl(): void {
        let urlTrimmed = this.url.trim();
        if ( !urlTrimmed ) {
            this.errorLabel = 'MSG_INPUT_REQUIRED';
        } else if ( !this.urlIsValid( urlTrimmed )) {
            this.errorLabel = 'LBL_INPUT_INVALID';
        } else {
            this.errorLabel = '';
        }
        this.canSubmit = !this.errorLabel;
        if ( this.textIsUrl ) this.text = this.url;
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
        this.response.emit({ url: this.url.trim(), toTrack: this.toTrack, text: this.text.trim() });
        this.self.destroy(); // close the modal
    }

    /**
     * Cancel adding/editing a link and close the modal.
     */
    public cancel() {
        this.response.emit(null);
        this.self.destroy(); // close the modal
    }

}
