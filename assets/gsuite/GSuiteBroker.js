var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * handle the communication between the system and GSuite
 */
class GSuiteBroker {
    constructor(configs) {
        this.loadExtension(configs);
    }
    /**
     * Use the InboxSDK Wrapper Library to load the system instance in the gmail
     * @param configs
     */
    loadExtension(configs) {
        if (!configs.appId || !configs.systemUrl)
            return;
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
    handleThreadView(ThreadView) {
        return __awaiter(this, void 0, void 0, function* () {
            this.threadView = ThreadView;
            const responseObject = { source: 'GSuite', messageType: 'messageUpdate', response: { thread_id: '' } };
            responseObject.response.thread_id = yield this.threadView.getThreadIDAsync();
            window.frames.SpiceCRM.postMessage(responseObject, '*');
            ThreadView.addListener('destroy', () => {
                responseObject.response.thread_id = undefined;
                window.frames.SpiceCRM.postMessage(responseObject, '*');
                ThreadView.removeAllListeners();
            });
        });
    }
    /**
     * get message email addresses and add attachments listener
     * @param MessageView
     */
    messageViewHandler(MessageView) {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMessageAttachmentsClickListener(MessageView);
            const responseObject = { source: 'GSuite', messageType: 'messageUpdate', response: { attachments: [], emailAddresses: [] } };
            const recipients = yield MessageView.getRecipientsFull();
            const sender = yield MessageView.getSender().emailAddress;
            responseObject.response.emailAddresses = [...recipients.map(addr => addr.emailAddress), sender];
            window.frames.SpiceCRM.postMessage(responseObject, '*');
        });
    }
    /**
     * add message attachments click listener to get the download url
     * @param MessageView
     */
    addMessageAttachmentsClickListener(MessageView) {
        MessageView.getFileAttachmentCardViews().forEach(AttachmentCardView => {
            AttachmentCardView.addButton({
                tooltip: 'Add to SpiceCRM Archive Attachments',
                iconUrl: '<serverurl>/assets/gsuite/icon48.png',
                onClick: (e) => __awaiter(this, void 0, void 0, function* () {
                    const responseObject = { source: 'GSuite', messageType: 'messageUpdate', response: { attachment: {} } };
                    const content = yield this.downloadEmailAttachment(yield e.getDownloadURL());
                    responseObject.response.attachment = {
                        id: Date.now(),
                        name: AttachmentCardView.getTitle(),
                        contentType: AttachmentCardView.getAttachmentType(),
                        isInline: false,
                        content
                    };
                    window.frames.SpiceCRM.postMessage(responseObject, '*');
                })
            });
        });
    }
    /**
     * handle iframe communication data from window onmessage event
     * @param e
     */
    handleSpiceRequest(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.threadView || !e.data || e.data.source != 'SpiceCRM' || !e.data.messageType)
                return;
            const responseObject = { source: 'GSuite', messageType: e.data.messageType, id: e.data.id, response: undefined };
            switch (e.data.messageType) {
                case 'getThreadId':
                    if (!!this.threadView) {
                        responseObject.response = yield this.threadView.getThreadIDAsync();
                    }
                    e.source.window.postMessage(responseObject, '*');
                    break;
                case 'getEmailAddresses':
                    responseObject.response = yield this.getEmailAddresses();
                    e.source.window.postMessage(responseObject, '*');
                    break;
                case 'getEmailMessages':
                    this.getEmailMessages(e.source, responseObject);
                    break;
            }
        });
    }
    /**
     * download email attachment from url and return base64 string
     * @param downloadUrl
     * @return base64
     */
    downloadEmailAttachment(downloadUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(downloadUrl, { method: 'POST' });
            const blob = yield response.blob();
            const base64 = yield this.readFileAsync(blob);
            return JSON.stringify(base64.replace(/^data:.+;base64,/, ''));
        });
    }
    /**
     * get email data from thread
     * @param source
     * @param data
     */
    getEmailMessages(source, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const threadId = yield this.threadView.getThreadIDAsync();
            data.response = [];
            yield Promise.all(this.threadView.getMessageViews().map((MessageView) => __awaiter(this, void 0, void 0, function* () {
                const recipients = yield MessageView.getRecipientsFull();
                data.response.push({
                    body: yield this.parseMessageBody(MessageView.getBodyElement().innerHTML),
                    to: recipients.map(addr => addr.emailAddress),
                    date: MessageView.getDateString(),
                    from: yield MessageView.getSender().emailAddress,
                    message_id: yield MessageView.getMessageIDAsync(),
                    thread_id: threadId,
                    subject: this.threadView.getSubject(),
                });
            })));
            source.window.postMessage(data, '*');
        });
    }
    /**
     * download body inline images and replace it with base64 inline src
     * @param body
     * @return body
     */
    parseMessageBody(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let regexp = /<img[^>]+src="?([^"\s]+)"/g;
            const promises = [];
            const htmlDecodeTextarea = document.createElement('textarea');
            body.replace(regexp, (match, ...args) => {
                if (args[0].includes('http')) {
                    htmlDecodeTextarea.innerHTML = args[0];
                    promises.push(this.downloadImageToBase64(htmlDecodeTextarea.innerText));
                }
            });
            const data = yield Promise.all(promises);
            data.forEach(item => body = body.replace(item.src, item.base64));
            return JSON.stringify(body);
        });
    }
    /**
     * download image from url and convert it to base64 inline image
     * @param imageSrc
     * @return base64ImageSrc
     */
    downloadImageToBase64(imageSrc) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(imageSrc, { method: 'GET' });
            const blob = yield response.blob();
            return {
                base64: yield this.readFileAsync(blob),
                src: imageSrc
            };
        });
    }
    /**
     * read file async and return promise
     * @param blob
     */
    readFileAsync(blob) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        });
    }
    /**
     * get email addresses from the thread view
     * @return Promise of emailAddresses array
     */
    getEmailAddresses() {
        return __awaiter(this, void 0, void 0, function* () {
            let emailAddresses = [];
            yield Promise.all(this.threadView.getMessageViewsAll().map((MessageView) => __awaiter(this, void 0, void 0, function* () {
                const recipients = yield MessageView.getRecipientsFull();
                const sender = yield MessageView.getSender().emailAddress;
                recipients.forEach(addr => {
                    if (emailAddresses.indexOf(addr.emailAddress) < 0) {
                        emailAddresses.push(addr.emailAddress);
                    }
                });
                if (recipients.indexOf(sender) < 0) {
                    emailAddresses.push(sender);
                }
            })));
            return emailAddresses;
        });
    }
}
const broker = new GSuiteBroker({
    appId: 'sdk_GmailSpiceCRM_e3525c3e60',
    systemUrl: '<serverurl>/gsuite.html',
    iconUrl: '<serverurl>/assets/gsuite/icon48.png'
});
//# sourceMappingURL=GSuiteBroker.js.map