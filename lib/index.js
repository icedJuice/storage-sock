'use strict';

var _createClass = require('@babel/runtime/helpers/createClass');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);

/** 消息类型： 链接消息 */
var MSG_TYPE_CONNECT = 0x1001;
/** 消息类型： 数据发送消息 */

var MSG_TYPE_IO = 0x1002;
/** localstorage 存储的键名 */

var __STORAGE_BRIDGE_KEY__ = "__preview_soc_birdge_key__";

var PreviewSoc = /*#__PURE__*/function () {
  function PreviewSoc() {
    var _this = this;

    this._id = void 0;
    this._onMessage = void 0;
    this._onPreviewReady = void 0;
    this._prevData = void 0;

    this._messageReceiver = function (e) {
      if (e.key !== __STORAGE_BRIDGE_KEY__) {
        return;
      }

      var message = JSON.parse(e.newValue || "");

      if (!_this._id || (message == null ? void 0 : message.id) !== _this._id) {
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

    this.sendMessage = function (data) {
      _this._prevData = data;
      window.localStorage.setItem(__STORAGE_BRIDGE_KEY__, JSON.stringify({
        id: _this._id,
        type: MSG_TYPE_IO,
        data: data
      }));
    };

    this.bind = function (id) {
      _this._id = id;
      window.removeEventListener("storage", _this._messageReceiver, false);
      window.addEventListener("storage", _this._messageReceiver, false);
    };

    this.ready = function () {
      if (!_this._id) {
        console.log("%c ready failed. you need bind id first, use: soc.bind(id as your id)", "background: red");
        return;
      }

      window.localStorage.setItem(__STORAGE_BRIDGE_KEY__, JSON.stringify({
        id: _this._id,
        type: MSG_TYPE_CONNECT
      }));
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

  _createClass__default["default"](PreviewSoc, [{
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

  return PreviewSoc;
}();

module.exports = PreviewSoc;
