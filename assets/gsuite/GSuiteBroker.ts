declare var InboxSDK;

/**
 * handle the communication between the system and GSuite
 */
class GSuiteBroker {
    /**
     * ThreadView instance defined by the InboxSDK library
     */
    private threadView: any;

    constructor(configs: { appId: string, systemUrl: string, iconUrl: string }) {
        this.loadExtension(configs);
    }

    /**
     * Use the InboxSDK Wrapper Library to load the system instance in the gmail
     * @param configs
     */
    private loadExtension(configs) {

        if (!configs.appId || !configs.systemUrl) return;

        InboxSDK.load(2, configs.appId).then((sdk) => {

            let spice = document.createElement('iframe');
            spice.src = configs.systemUrl;
            spice.style.height = 'calc(100vh - 40px)';
            spice.style.border = '0';
            spice.name = 'SpiceCRM';

            sdk.Global.addSidebarContentPanel({
                el: spice,
                title: 'SpiceCRM',
                hideTitleBar: true,
                iconUrl: configs.iconUrl
            });

            sdk.Conversations.registerThreadViewHandler(e => this.handleThreadView(e));
            sdk.Conversations.registerMessageViewHandler(e => this.messageViewHandler(e));

            window.addEventListener('message', e => this.handleSpiceRequest(e));
        });

    }

    /**
     * set this threadView and pass the id to SpiceCRM
     * @param ThreadView
     */
    private async handleThreadView(ThreadView) {
        this.threadView = ThreadView;

        const responseObject = {source: 'GSuite', messageType: 'messageUpdate', response: {thread_id: ''}};
        responseObject.response.thread_id = await this.threadView.getThreadIDAsync();
        (window as any).frames.SpiceCRM.postMessage(responseObject, '*');

        ThreadView.addListener('destroy', () => {
            responseObject.response.thread_id = undefined;
            (window as any).frames.SpiceCRM.postMessage(responseObject, '*');
            ThreadView.removeAllListeners();
        });
    }

    /**
     * get message email addresses and add attachments listener
     * @param MessageView
     */
    private async messageViewHandler(MessageView) {

        this.addMessageAttachmentsClickListener(MessageView);

        const responseObject = {source: 'GSuite', messageType: 'messageUpdate', response: {attachments: [], emailAddresses: []}};
        const recipients = await MessageView.getRecipientsFull();
        const sender = await MessageView.getSender().emailAddress;
        responseObject.response.emailAddresses = [...recipients.map(addr => addr.emailAddress), sender];
        (window as any).frames.SpiceCRM.postMessage(responseObject, '*');

    }

    /**
     * add message attachments click listener to get the download url
     * @param MessageView
     */
    private addMessageAttachmentsClickListener(MessageView) {

        MessageView.getFileAttachmentCardViews().forEach(AttachmentCardView => {

            AttachmentCardView.addButton({
                tooltip: 'Add to SpiceCRM Archive Attachments',
                iconUrl: '<serverurl>/assets/gsuite/icon48.png',
                onClick: async (e) => {
                    const responseObject = {source: 'GSuite', messageType: 'messageUpdate', response: {attachment: {}}};
                    const content = await this.downloadEmailAttachment(await e.getDownloadURL());
                    responseObject.response.attachment = {
                        id: Date.now(),
                        name: AttachmentCardView.getTitle(),
                        contentType: AttachmentCardView.getAttachmentType(),
                        isInline: false,
                        content
                    };

                    (window as any).frames.SpiceCRM.postMessage(responseObject, '*');
                }
            });
        });
    }

    /**
     * handle iframe communication data from window onmessage event
     * @param e
     */
    private async handleSpiceRequest(e: MessageEvent) {

        if (!this.threadView || !e.data || e.data.source != 'SpiceCRM' || !e.data.messageType) return;

        const responseObject = {source: 'GSuite', messageType: e.data.messageType, id: e.data.id, response: undefined};

        switch (e.data.messageType) {
            case 'getThreadId':

                if (!!this.threadView) {
                    responseObject.response = await this.threadView.getThreadIDAsync();
                }
                (e.source as any).window.postMessage(responseObject, '*');
                break;
            case 'getEmailAddresses':
                responseObject.response = await this.getEmailAddresses();
                (e.source as any).window.postMessage(responseObject, '*');
                break;
            case 'getEmailMessages':
                this.getEmailMessages(e.source, responseObject);
                break;
        }
    }

    /**
     * download email attachment from url and return base64 string
     * @param downloadUrl
     * @return base64
     */
    private async downloadEmailAttachment(downloadUrl: string): Promise<string> {
        const response = await fetch(downloadUrl, {method: 'POST'});
        const blob = await response.blob();
        const base64 = await this.readFileAsync(blob);
        return JSON.stringify(base64.replace(/^data:.+;base64,/, ''));
    }

    /**
     * get email data from thread
     * @param source
     * @param data
     */
    private async getEmailMessages(source, data) {

        const threadId = await this.threadView.getThreadIDAsync();
        data.response = [];

        await Promise.all(this.threadView.getMessageViews().map(async MessageView => {

                const recipients = await MessageView.getRecipientsFull();

                data.response.push({
                    body: await this.parseMessageBody(MessageView.getBodyElement().innerHTML),
                    to: recipients.map(addr => addr.emailAddress),
                    date: MessageView.getDateString(),
                    from: await MessageView.getSender().emailAddress,
                    message_id: await MessageView.getMessageIDAsync(),
                    thread_id: threadId,
                    subject: this.threadView.getSubject(),
                });
            })
        );

        source.window.postMessage(data, '*');
    }

    /**
     * download body inline images and replace it with base64 inline src
     * @param body
     * @return body
     */
    private async parseMessageBody(body): Promise<string> {
        let regexp = /<img[^>]+src="?([^"\s]+)"/g;
        const promises = [];
        const htmlDecodeTextarea = document.createElement('textarea');

        body.replace(regexp, (match, ...args) => {
            if (args[0].includes('http')) {
                htmlDecodeTextarea.innerHTML = args[0];
                promises.push(this.downloadImageToBase64(htmlDecodeTextarea.innerText));
            }
        });

        const data = await Promise.all(promises);
        data.forEach(item => body = body.replace(item.src, item.base64));

        return JSON.stringify(body);
    }

    /**
     * download image from url and convert it to base64 inline image
     * @param imageSrc
     * @return base64ImageSrc
     */
    private async downloadImageToBase64(imageSrc: string): Promise<{ base64: string, src: string }> {
        const response = await fetch(imageSrc, {method: 'GET'});
        const blob = await response.blob();
        return {
            base64: await this.readFileAsync(blob),
            src: imageSrc
        };
    }

    /**
     * read file async and return promise
     * @param blob
     */
    private async readFileAsync(blob: Blob): Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    /**
     * get email addresses from the thread view
     * @return Promise of emailAddresses array
     */
    private async getEmailAddresses(): Promise<any> {
        let emailAddresses = [];
        await Promise.all(
            this.threadView.getMessageViewsAll().map(async MessageView => {
                const recipients = await MessageView.getRecipientsFull();
                const sender = await MessageView.getSender().emailAddress;
                recipients.forEach(addr => {
                    if (emailAddresses.indexOf(addr.emailAddress) < 0) {
                        emailAddresses.push(addr.emailAddress);
                    }
                });
                if (recipients.indexOf(sender) < 0) {
                    emailAddresses.push(sender);
                }
            })
        );
        return emailAddresses;
    }
}

const broker = new GSuiteBroker({
    appId: 'sdk_GmailSpiceCRM_e3525c3e60',
    systemUrl: '<serverurl>/gsuite.html',
    iconUrl: '<serverurl>/assets/gsuite/icon48.png'
});
