declare class StorageSock {
    private _id;
    private _onMessage;
    private _onPreviewReady;
    private _prevData;
    constructor();
    get onMessage(): ((data: any) => void) | null;
    set onMessage(onmesssagefn: ((data: any) => void) | null);
    get onPreviewReady(): (() => void) | null;
    set onPreviewReady(onpreviewreadyfn: (() => void) | null);
    private _messageReceiver;
    private setData;
    readonly sendMessage: (data: any) => void;
    readonly bind: (id: string) => void;
    readonly ready: () => void;
    readonly destory: () => void;
}
export default StorageSock;
