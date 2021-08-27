var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var GSuiteBroker = (function () {
    function GSuiteBroker(configs) {
        this.loadExtension(configs);
    }
    GSuiteBroker.prototype.loadExtension = function (configs) {
        var _this = this;
        if (!configs.appId || !configs.systemUrl)
            return;
        InboxSDK.load(2, configs.appId).then(function (sdk) {
            var spice = document.createElement('iframe');
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
            sdk.Conversations.registerThreadViewHandler(function (e) { return _this.handleThreadView(e); });
            sdk.Conversations.registerMessageViewHandler(function (e) { return _this.messageViewHandler(e); });
            window.addEventListener('message', function (e) { return _this.handleSpiceRequest(e); });
        });
    };
    GSuiteBroker.prototype.handleThreadView = function (ThreadView) {
        return __awaiter(this, void 0, void 0, function () {
            var responseObject, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.threadView = ThreadView;
                        responseObject = { source: 'GSuite', messageType: 'messageUpdate', response: { thread_id: '' } };
                        _a = responseObject.response;
                        return [4, this.threadView.getThreadIDAsync()];
                    case 1:
                        _a.thread_id = _b.sent();
                        window.frames.SpiceCRM.postMessage(responseObject, '*');
                        ThreadView.addListener('destroy', function () {
                            responseObject.response.thread_id = undefined;
                            window.frames.SpiceCRM.postMessage(responseObject, '*');
                            ThreadView.removeAllListeners();
                        });
                        return [2];
                }
            });
        });
    };
    GSuiteBroker.prototype.messageViewHandler = function (MessageView) {
        return __awaiter(this, void 0, void 0, function () {
            var responseObject, recipients;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.addMessageAttachmentsClickListener(MessageView);
                        responseObject = { source: 'GSuite', messageType: 'messageUpdate', response: { attachments: [], emailAddresses: [] } };
                        return [4, MessageView.getRecipientsFull()];
                    case 1:
                        recipients = _a.sent();
                        responseObject.response.emailAddresses = recipients.map(function (addr) { return addr.emailAddress; });
                        window.frames.SpiceCRM.postMessage(responseObject, '*');
                        return [2];
                }
            });
        });
    };
    GSuiteBroker.prototype.addMessageAttachmentsClickListener = function (MessageView) {
        var _this = this;
        MessageView.getFileAttachmentCardViews().forEach(function (AttachmentCardView) {
            AttachmentCardView.addButton({
                tooltip: 'Add to SpiceCRM Archive Attachments',
                iconUrl: '<serverurl>/assets/gsuite/icon48.png',
                onClick: function (e) { return __awaiter(_this, void 0, void 0, function () {
                    var responseObject, content, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                responseObject = { source: 'GSuite', messageType: 'messageUpdate', response: { attachment: {} } };
                                _a = this.downloadEmailAttachment;
                                return [4, e.getDownloadURL()];
                            case 1: return [4, _a.apply(this, [_b.sent()])];
                            case 2:
                                content = _b.sent();
                                responseObject.response.attachment = {
                                    id: Date.now(),
                                    name: AttachmentCardView.getTitle(),
                                    contentType: AttachmentCardView.getAttachmentType(),
                                    isInline: false,
                                    content: content
                                };
                                window.frames.SpiceCRM.postMessage(responseObject, '*');
                                return [2];
                        }
                    });
                }); }
            });
        });
    };
    GSuiteBroker.prototype.handleSpiceRequest = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var responseObject, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.threadView || !e.data || e.data.source != 'SpiceCRM' || !e.data.messageType)
                            return [2];
                        responseObject = { source: 'GSuite', messageType: e.data.messageType, id: e.data.id, response: undefined };
                        _a = e.data.messageType;
                        switch (_a) {
                            case 'getThreadId': return [3, 1];
                            case 'getEmailAddresses': return [3, 4];
                            case 'getEmailMessages': return [3, 6];
                        }
                        return [3, 7];
                    case 1:
                        if (!!!this.threadView) return [3, 3];
                        _b = responseObject;
                        return [4, this.threadView.getThreadIDAsync()];
                    case 2:
                        _b.response = _d.sent();
                        _d.label = 3;
                    case 3:
                        e.source.window.postMessage(responseObject, '*');
                        return [3, 7];
                    case 4:
                        _c = responseObject;
                        return [4, this.getEmailAddresses()];
                    case 5:
                        _c.response = _d.sent();
                        e.source.window.postMessage(responseObject, '*');
                        return [3, 7];
                    case 6:
                        this.getEmailMessages(e.source, responseObject);
                        return [3, 7];
                    case 7: return [2];
                }
            });
        });
    };
    GSuiteBroker.prototype.downloadEmailAttachment = function (downloadUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var response, blob, base64;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, fetch(downloadUrl, { method: 'POST' })];
                    case 1:
                        response = _a.sent();
                        return [4, response.blob()];
                    case 2:
                        blob = _a.sent();
                        return [4, this.readFileAsync(blob)];
                    case 3:
                        base64 = _a.sent();
                        return [2, JSON.stringify(base64.replace(/^data:.+;base64,/, ''))];
                }
            });
        });
    };
    GSuiteBroker.prototype.getEmailMessages = function (source, data) {
        return __awaiter(this, void 0, void 0, function () {
            var threadId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.threadView.getThreadIDAsync()];
                    case 1:
                        threadId = _a.sent();
                        data.response = [];
                        return [4, Promise.all(this.threadView.getMessageViews().map(function (message) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _b = (_a = data.response).push;
                                            _c = {};
                                            return [4, this.parseMessageBody(message.getBodyElement().innerHTML)];
                                        case 1:
                                            _c.body = _d.sent();
                                            return [4, this.getEmailAddresses()];
                                        case 2:
                                            _c.to = _d.sent(),
                                                _c.date = message.getDateString();
                                            return [4, message.getSender().emailAddress];
                                        case 3:
                                            _c.from = _d.sent();
                                            return [4, message.getMessageIDAsync()];
                                        case 4:
                                            _b.apply(_a, [(_c.message_id = _d.sent(),
                                                    _c.thread_id = threadId,
                                                    _c.subject = this.threadView.getSubject(),
                                                    _c)]);
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        source.window.postMessage(data, '*');
                        return [2];
                }
            });
        });
    };
    GSuiteBroker.prototype.parseMessageBody = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var regexp, promises, htmlDecodeTextarea, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        regexp = /<img[^>]+src="?([^"\s]+)"/g;
                        promises = [];
                        htmlDecodeTextarea = document.createElement('textarea');
                        body.replace(regexp, function (match) {
                            var args = [];
                            for (var _i = 1; _i < arguments.length; _i++) {
                                args[_i - 1] = arguments[_i];
                            }
                            if (args[0].includes('http')) {
                                htmlDecodeTextarea.innerHTML = args[0];
                                promises.push(_this.downloadImageToBase64(htmlDecodeTextarea.innerText));
                            }
                        });
                        return [4, Promise.all(promises)];
                    case 1:
                        data = _a.sent();
                        data.forEach(function (item) { return body = body.replace(item.src, item.base64); });
                        return [2, JSON.stringify(body)];
                }
            });
        });
    };
    GSuiteBroker.prototype.downloadImageToBase64 = function (imageSrc) {
        return __awaiter(this, void 0, void 0, function () {
            var response, blob, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, fetch(imageSrc, { method: 'GET' })];
                    case 1:
                        response = _b.sent();
                        return [4, response.blob()];
                    case 2:
                        blob = _b.sent();
                        _a = {};
                        return [4, this.readFileAsync(blob)];
                    case 3: return [2, (_a.base64 = _b.sent(),
                            _a.src = imageSrc,
                            _a)];
                }
            });
        });
    };
    GSuiteBroker.prototype.readFileAsync = function (blob) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function () { return resolve(reader.result); };
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    })];
            });
        });
    };
    GSuiteBroker.prototype.getEmailAddresses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var emailAddresses;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        emailAddresses = [];
                        return [4, Promise.all(this.threadView.getMessageViewsAll().map(function (message) { return __awaiter(_this, void 0, void 0, function () {
                                var recipients;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, message.getRecipientsFull()];
                                        case 1:
                                            recipients = _a.sent();
                                            emailAddresses = __spreadArrays(emailAddresses, recipients.map(function (addr) { return addr.emailAddress; }));
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2, emailAddresses];
                }
            });
        });
    };
    return GSuiteBroker;
}());
var broker = new GSuiteBroker({
    appId: 'sdk_GmailSpiceCRM_e3525c3e60',
    systemUrl: '<serverurl>/gsuite.html',
    iconUrl: '<serverurl>/assets/gsuite/icon48.png'
});
//# sourceMappingURL=GSuiteBroker.js.map