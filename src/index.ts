import {
  MSG_TYPE_CONNECT,
  MSG_TYPE_IO,
  __STORAGE_BRIDGE_KEY__,
} from "./constants";

export interface PreviewSocProps {
  id: string;
}

export type PreviewSocOnMessageFn = (data: any) => void;

export type PreviewSocOnPreviewReadyFn = () => void;

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

class PreviewSoc {
  private _id: string | null;
  private _onMessage: PreviewSocOnMessageFn | null;
  private _onPreviewReady: PreviewSocOnPreviewReadyFn | null;
  private _prevData: any;

  constructor() {
    this._id = null;
    this._onMessage = null;
    this._onPreviewReady = null;
    this._prevData = null;
  }

  get onMessage() {
    return this._onMessage;
  }

  set onMessage(onmesssagefn) {
    this._onMessage = onmesssagefn;
  }

  get onPreviewReady() {
    return this._onPreviewReady;
  }

  set onPreviewReady(onpreviewreadyfn) {
    this._onPreviewReady = onpreviewreadyfn;
  }

  private _messageReceiver = (e: globalThis.StorageEvent): any => {
    if (e.key !== __STORAGE_BRIDGE_KEY__) {
      return;
    }
    const message: PreviewSocMessage = JSON.parse(e.newValue || "");

    if (!this._id || message?.id !== this._id) {
      return;
    }

    switch (message.type) {
      case MSG_TYPE_CONNECT:
        this.sendMessage(this._prevData);
        if (this._onPreviewReady) {
          this._onPreviewReady();
        }
        break;
      case MSG_TYPE_IO:
        if (this._onMessage) {
          this._onMessage(message.data);
        }
        break;
      default:
    }
  };

  public readonly sendMessage = (data: any) => {
    this._prevData = data;
    window.localStorage.setItem(
      __STORAGE_BRIDGE_KEY__,
      JSON.stringify({ id: this._id, type: MSG_TYPE_IO, data }),
    );
  };

  public readonly bind = (id: string) => {
    this._id = id;
    window.removeEventListener("storage", this._messageReceiver, false);
    window.addEventListener("storage", this._messageReceiver, false);
  };

  public readonly ready = () => {
    if (!this._id) {
      console.log(
        "%c ready failed. you need bind id first, use: soc.bind(id as your id)",
        "background: red",
      );
      return;
    }

    window.localStorage.setItem(
      __STORAGE_BRIDGE_KEY__,
      JSON.stringify({ id: this._id, type: MSG_TYPE_CONNECT }),
    );
  };

  public readonly destory = () => {
    this._id = null;
    window.removeEventListener("storage", this._messageReceiver, false);
  };
}

export default PreviewSoc;
