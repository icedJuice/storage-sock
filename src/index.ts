/** 消息类型： 链接消息 */
const MSG_TYPE_CONNECT = 0xaae61;
/** 消息类型： 数据发送消息 */
const MSG_TYPE_IO = 0xaae62;
/** localstorage 存储的键名 */
const __STORAGE_BRIDGE_KEY__ = "__preview_soc_birdge_key__";

interface StorageSockMessage {
  id: string;
  data: any;
  type: typeof MSG_TYPE_CONNECT | typeof MSG_TYPE_IO;
}

class StorageSock {
  private _id: string | null;
  private _onMessage: ((data: any) => void) | null;
  private _onPreviewReady: (() => void) | null;
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

  private _messageReceiver = (e: globalThis.StorageEvent) => {
    if (e.key !== __STORAGE_BRIDGE_KEY__) {
      return;
    }
    const message: StorageSockMessage = JSON.parse(e.newValue || "{}");
    if (this._id && message?.id === this._id) {
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

  private setData = (
    type: typeof MSG_TYPE_CONNECT | typeof MSG_TYPE_IO,
    data?: any
  ) => {
    window.localStorage.setItem(
      __STORAGE_BRIDGE_KEY__,
      JSON.stringify({ id: this._id, type, data })
    );
  };

  public readonly sendMessage = (data: any) => {
    this._prevData = data;
    this.setData(MSG_TYPE_IO, data);
  };

  public readonly bind = (id: string) => {
    this._id = id;
    // 避免误操作多次绑定
    window.removeEventListener("storage", this._messageReceiver, false);
    window.addEventListener("storage", this._messageReceiver, false);
  };

  public readonly ready = () => {
    if (!this._id) {
      console.error(
        "ready failed. you need bind id first, use: soc.bind(id as your id)"
      );
      return;
    }
    this.setData(MSG_TYPE_CONNECT);
  };

  public readonly destory = () => {
    this._id = null;
    window.removeEventListener("storage", this._messageReceiver, false);
  };
}

export default StorageSock;

// interface Action<T> {
//   payload?: T;
//   type: string;
// }
// // 假设有Modle这样一个interface
// interface Module {
//   count: number;
//   message: string;
//   asyncMethod<T, U>(action: Promise<T>): Promise<Action<U>>;
//   syncMethod<T, U>(action: Action<T>): Action<U>;
// } 
// 实现type Connect
// 保留属性为函数类型，其余的摒弃掉
// 把函数类型转化为<T, U>(args: T) => Action<U>type Connect<T> = /** 你需要实现的逻辑 */



// type Connect<E> = {
//   [K in keyof E]: E[K] extends Function ? (
//     E[K] extends Promise<infer R> ? Action<R> : any
//   ) : never;
// };

// type Result = Connect<Module>;

// Result = {
//   asyncMethod<T, U>(input: T): Action<U>;
//   syncMethod<T, U>(action: T): Action<U>; 
// }
