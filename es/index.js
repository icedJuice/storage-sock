import _createClass from '@babel/runtime/helpers/esm/createClass';

/** 消息类型： 链接消息 */
var MSG_TYPE_CONNECT = 0xaae61;
/** 消息类型： 数据发送消息 */

var MSG_TYPE_IO = 0xaae62;
/** localstorage 存储的键名 */

var __STORAGE_BRIDGE_KEY__ = '__soc_birdge_key__';

var StorageSock = /*#__PURE__*/function () {
  function StorageSock() {
    var _this = this;

    this._id = void 0;
    this._onMessage = void 0;
    this._onPreviewReady = void 0;
    this._prevData = void 0;

    this._messageReceiver = function (e) {
      if (e.key !== __STORAGE_BRIDGE_KEY__) {
        return;
      }

      var message = JSON.parse(e.newValue || '{}');

      if (_this._id && (message == null ? void 0 : message.id) === _this._id) {
        return;
      }

      switch (message.type) {
        case MSG_TYPE_CONNECT:
          _this.sendMessage(_this._prevData);

          if (_this._onPreviewReady) {
            _this._onPreviewReady();
          }

          break;

        case MSG_TYPE_IO:
          if (_this._onMessage) {
            _this._onMessage(message.data);
          }

          break;
      }
    };

    this.setData = function (type, data) {
      window.localStorage.setItem(__STORAGE_BRIDGE_KEY__, JSON.stringify({
        id: _this._id,
        type: type,
        data: data
      }));
    };

    this.sendMessage = function (data) {
      _this._prevData = data;

      _this.setData(MSG_TYPE_IO, data);
    };

    this.bind = function (id) {
      _this._id = id; // 避免误操作多次绑定

      window.removeEventListener("storage", _this._messageReceiver, false);
      window.addEventListener("storage", _this._messageReceiver, false);
    };

    this.ready = function () {
      if (!_this._id) {
        console.error('ready failed. you need bind id first, use: soc.bind(id as your id)');
        return;
      }

      _this.setData(MSG_TYPE_CONNECT);
    };

    this.destory = function () {
      _this._id = null;
      window.removeEventListener("storage", _this._messageReceiver, false);
    };

    this._id = null;
    this._onMessage = null;
    this._onPreviewReady = null;
    this._prevData = null;
  }

  _createClass(StorageSock, [{
    key: "onMessage",
    get: function get() {
      return this._onMessage;
    },
    set: function set(onmesssagefn) {
      this._onMessage = onmesssagefn;
    }
  }, {
    key: "onPreviewReady",
    get: function get() {
      return this._onPreviewReady;
    },
    set: function set(onpreviewreadyfn) {
      this._onPreviewReady = onpreviewreadyfn;
    }
  }]);

  return StorageSock;
}();

export { StorageSock as default };
