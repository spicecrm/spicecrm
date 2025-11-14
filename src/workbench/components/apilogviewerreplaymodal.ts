/**
 * @module WorkbenchModule
 */
import { Component } from '@angular/core';
import { language } from '../../services/language.service';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';
import { libloader } from '../../services/libloader.service';
import { modal } from '../../services/modal.service';
import { helper } from '../../services/helper.service';
import { take } from 'rxjs/operators';

declare var html_beautify: any;
declare var _: any;

/**
 * a modal to dsiplay an API Log entry record
 */
@Component({
    templateUrl: '../templates/apilogviewerreplaymodal.html',
    standalone: false
})
export class APIlogViewerReplayModal {

    public replayData: any;

    /**
     * reference to itself for closing the modal
     * @private
     */
    public self;

    public editMode = false;

    /**
     * the entry
     */
    // @Input() public entry: any;

    public record: any = {};

    /**
     * the request headers
     *
     * @private
     */
    public _requestheaders: any = {};

    /**
     * indicates we are loading
     *
     * @private
     */
    public isLoading = false;

    /**
     * the currently selected logtable
     */
    public logtable: string = 'sysapilog';

    /**
     * set to true if we found the proper beautify lib and loaded it
     */
    public beautifyenabled: boolean = false;

    /**
     * the active tab in the tabbed view
     */
    public activeTab: 'requestHeaders' | 'body' | 'get' = 'requestHeaders';

    public contentType = '';

    public hasBodyData: boolean;

    public canEdit = false;

    public dataImmutable = false;

    public contentTypeShort: 'xml'|'json'|'form';

    public xmlNodes: any;

    constructor(public language: language, public backend: backend, public toast: toast, public libloader: libloader, public modal: modal, public helper: helper ) {
        this.libloader.loadLib('jsbeautify').subscribe(loaded => {
            this.beautifyenabled = true;
        });
    }

    public ngOnInit()
    {
        // this.loadFullData();
        this.doRecord();
    }

    /**
     * Load the full data (with the un-truncated log text) and merge the full text to the record got from parent component.
     *
     * @private
     */
    /*
    public loadFullData()
    {
        this.isLoading = true;
        this.backend.getRequest(`admin/apilog/${this.entry.id}`, {logtable: this.logtable}).subscribe({
            next: (response) => {
                this.record = response;
                // try to parse the headers so we know how to handle post and response params
                this.doRecord();
                this.isLoading = false;
            },
            error: (error) => {
                this.toast.sendToast('Error loading entry of log file!', 'error', 'Entry ' + this.entry.id + ' of REST log couldn´t be fetched.', false);
                this.isLoading = false;
                this.close();
            }
        });
    }
     */

    public doRecord()
    {
        this.setRequestHeaders();
        this.contentType = this.determineContentType( this._requestheaders );
        switch( this.contentType )
        {
            case 'application/json':
            case 'application/x-ndjson':
                this.replayData = ( this.record.request_body ? JSON.parse( this.record.request_body ) : null );
                this.contentTypeShort = 'json';
                break;
            case 'text/xml':
            case 'application/xml':
                this.replayData = ( new DOMParser() ).parseFromString( this.record.request_body, "application/xml");
                this.xmlNodes = this.getNodes( this.replayData );
                this.contentTypeShort = 'xml';
                break;
            case 'application/x-www-form-urlencoded':
                this.replayData = {}; // still to do!
                this.contentTypeShort = 'form';
                this.dataImmutable = true;
        }
        this.hasBodyData = this.record.request_body && this.record.request_body != "{}";
        this.canEdit = ( this.contentType === 'application/json' || this.contentType === 'application/xml') && this.hasBodyData;
    }

    /**
     * try to set the request header
     *
     * @private
     */
    public setRequestHeaders() {
        try {
            let headers = JSON.parse(this.record.request_headers);
            if (headers) {
                this._requestheaders = headers;
            }

        } catch (e) {
            this._requestheaders = {};
        }
    }

    /**
     * returns the parsed request headers as table
     */
    get requestHeaders() {
        if (this.record.request_headers) {
            try {
                let retArray = [];
                let headers = JSON.parse(this.record.request_headers);
                for (let entry in headers) {
                    retArray.push({
                        name: entry,
                        value: headers[entry]
                    });
                }
                return retArray;
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    /**
     * returns the parsed request headers as table
     */
    get requestArguments() {
        if (this.record.request_args) {
            try {
                let retArray = [];
                let args = JSON.parse(this.record.request_args);
                for (let arg in args) {
                    retArray.push({
                        name: arg,
                        value: args[arg]
                    });
                }
                return retArray;
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    /**
     * returns the parsed request Paramaters
     */
    get requestParams() {
        if (this.record.request_params) {
            try {
                let retArray = [];
                let params = JSON.parse(this.record.request_params);
                for (let param in params) {
                    retArray.push({
                        name: param,
                        value: params[param]
                    });
                }
                return retArray;
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    // Close the modal.
    public close() {
        this.self.destroy();
    }

    public determineContentType(headers: any) {
        let ct = 'application/json';
        for (let h in headers) {
            if (h.toLowerCase() == 'content-type') {
                let ctf = _.isArray(headers[h]) ? headers[h][0].toLowerCase().trim() : headers[h].toLowerCase().trim();
                let cta = ctf.split(';');
                ct = cta[0].trim();
                break;
            }
        }
        return ct;
    }

    public formattedRequest() {
        return this.getFormattedBody(this.determineContentType(this._requestheaders), this.record.request_body);
    }

    public doReplay(): void
    {
        this.modal.prompt('confirm', this.language.getLabel('LBL_CONFIRM_API_REPLAY', '', 'long'), this.language.getLabel('LBL_CONFIRM_API_REPLAY'))
            .pipe(take(1))
            .subscribe({
               next: confirmation => {
                   if ( !confirmation ) return;
                   if ( this.record.needsAuthorization ) this.modal.prompt('input_password', this.language.getLabel('LBL_API_REPLAY_PW_PROMPT', '', 'long'), this.language.getLabel('LBL_API_REPLAY_PW_PROMPT'))
                       .pipe(take(1))
                       .subscribe({
                           next: ( val: string|boolean ) => {
                               if ( val !== false ) { // @ts-ignore
                                   this.sendReplay( val );
                               }
                           }
                       })
                   else this.sendReplay( null );
               }
            });
    }

    public sendReplay( password: string|null ): void
    {
        let body = undefined;
        if ( password ) password = this.helper.encodeBase64( password );
        if ( this.editMode ) {
            if ( this.replayData ) {
                switch( this.contentType ) {
                    case 'application/xml':
                        body = ( new XMLSerializer() ).serializeToString( this.replayData );
                        break;
                    case 'application/json':
                        body = JSON.stringify( this.replayData );
                        break;
                }
            }
        } else {
            body = this.record.request_body;
        }
        this.backend.postRequest('admin/apilog/replay/'+this.record.id, null, { headers: null, getParams: null, bodyParams: body, password: password ? password : undefined })
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    let responseText: string;
                    let responseObject: any;
                    this.isLoading = false;
                    if ( response.success ) {
                        this.toast.sendToast( 'LBL_REPLAY_SUCCESSFUL', 'success' );
                        this.self.destroy();
                    } else {
                        if ( response.response ) {
                            try {
                                responseObject = JSON.parse( response.response );
                            } catch (e) {
                                responseObject = {};
                            }
                            if ( responseObject.error && responseObject.error.message ) {
                                responseText = responseObject.error.message;
                            }
                        }
                        this.toast.sendToast('LBL_REPLAY_UNSUCCESSFUL', 'error', 'Status Code: ' + response.httpStatusCode + ( responseText ? ', Message: ' + responseText : '' ));
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.toast.sendToast('LBL_REPLAY_UNSUCCESSFUL', 'error');
                }
            });
    }

    public cancelReplay(): void
    {
        this.self.destroy();
    }

    public getType( value ): string
    {
        return typeof value;
    }

    public getFormattedBody(contentType, content) {
        switch (contentType) {
            case 'application/json':
                try {
                    return JSON.stringify(JSON.parse(content), null, '\t');
                } catch (e) {
                    return content;
                }
                break;
            case 'application/x-ndjson':
                try {
                    let res = [];
                    let cItems = content.split('\n');
                    for (let cItem of cItems) {
                        if (cItem) {
                            res.push(JSON.stringify(JSON.parse(cItem), null, '\t'));
                        }
                    }
                    return res.join('\r\n\r\n');
                } catch (e) {
                    return content;
                }
                break;
            case 'application/x-www-form-urlencoded':
                let cArray = [];
                let ca = content.split('&');
                for (let ce of ca) {
                    let c = ce.split('=');
                    cArray.push({
                        name: c[0],
                        value: decodeURIComponent(c[1].replaceAll('+', ' '))
                    });
                }
                return cArray;
            case 'text/xml':
            case 'application/xml':
                return html_beautify(content, {
                    indent_size: 4,
                    indent_char: " ",
                    indent_with_tabs: false,
                    end_with_newline: false,
                    indent_level: 0,
                    preserve_newlines: true,
                    max_preserve_newlines: 10,
                    space_in_paren: false,
                    space_in_empty_paren: false,
                    unindent_chained_methods: false,
                    break_chained_methods: false,
                    keep_array_indentation: false,
                    unescape_strings: false,
                    wrap_line_length: 100,
                    e4x: false,
                    comma_first: false,
                    operator_position: "before-newline",
                    indent_empty_lines: false,
                    templating: ["auto"]
                });
                break;
            default:
                return content;
        }
    }

    /**
     * get the headers formatted
     */
    public formatted(param) {
        try {
            return JSON.stringify(JSON.parse(this.record[param]), null, '\t');
        } catch (e) {
            return this.record[param];
        }
    }

    public getNodes( doc)
    {

        let nodes = [];
        let node = doc.firstChild;

        if ( !node ) node = doc.appendChild( document.createTextNode('') );

        while ( node )
        {
            if ( node.nodeType === Node.TEXT_NODE ) {
                nodes.push({ name: doc.nodeName, isTextNode: true, node: node });
                break;
            } else if ( node.nodeType == Node.ELEMENT_NODE ) {
                nodes.push({ isElementNode: true, name: node.nodeName, childs: this.getNodes( node )} );
            }
            node = node.nextSibling;
        }
        return nodes;
    }

}
