import { MSG_TYPE_CONNECT, MSG_TYPE_IO } from "./constants";
export interface PreviewSocProps {
    id: string;
}
export declare type PreviewSocOnMessageFn = (data: any) => void;
export declare type PreviewSocOnPreviewReadyFn = () => void;
export interface PreviewSocMessage {
    id: string;
    data: any;
    type: typeof MSG_TYPE_CONNECT | typeof MSG_TYPE_IO;
}
export interface StorageEvent {
    isTrusted: boolean;
    oldValue: string;
    newValue: string;
    key: string;
}
declare class PreviewSoc {
    private _id;
    private _onMessage;
    private _onPreviewReady;
    private _prevData;
    constructor();
    get onMessage(): PreviewSocOnMessageFn | null;
    set onMessage(onmesssagefn: PreviewSocOnMessageFn | null);
    get onPreviewReady(): PreviewSocOnPreviewReadyFn | null;
    set onPreviewReady(onpreviewreadyfn: PreviewSocOnPreviewReadyFn | null);
    private _messageReceiver;
    readonly sendMessage: (data: any) => void;
    readonly bind: (id: string) => void;
    readonly ready: () => void;
    readonly destory: () => void;
}
export default PreviewSoc;
