"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // ../../win_webview2/dist/browser/runVirtualDirBrowser.js
  function registerListener() {
    if (registerListenerReady)
      return;
    window.chrome.webview.addEventListener("message", function(event) {
      let data = event.data;
      try {
        let jobj = JSON.parse(data);
        funRegistred[jobj.replyFun](jobj.data);
      } catch (error) {
        console.log("messageError ", error);
      }
    });
    registerListenerReady = true;
  }
  function callVirtualDirFunction(funName, param) {
    let ranNumber = Date.now();
    let replyFun = funName + ranNumber;
    registerListener();
    let jsonPost = {
      funName,
      data: param,
      replyFun
    };
    window.chrome.webview.postMessage(JSON.stringify(jsonPost));
    return new Promise((r, x) => {
      funRegistred[replyFun] = (msg) => {
        delete funRegistred[replyFun];
        r(msg);
      };
    });
  }
  var registerListenerReady, funRegistred;
  var init_runVirtualDirBrowser = __esm({
    "../../win_webview2/dist/browser/runVirtualDirBrowser.js"() {
      registerListenerReady = false;
      funRegistred = {};
    }
  });

  // ../../win_webview2/dist/browser/ww2_browser.js
  function callWw2(arg) {
    return __async(this, null, function* () {
      let response = yield fetch("/ww2_post", {
        method: "POST",
        body: JSON.stringify(arg),
        headers: {
          "Content-Type": "application/json"
        }
      });
      let result = yield response.json();
      return result;
    });
  }
  var init_ww2_browser = __esm({
    "../../win_webview2/dist/browser/ww2_browser.js"() {
      init_runVirtualDirBrowser();
    }
  });

  // srcBrowser/app_browser.ts
  var require_app_browser = __commonJS({
    "srcBrowser/app_browser.ts"(exports) {
      init_ww2_browser();
      (() => {
        function btn(selector) {
          return document.querySelector(selector);
        }
        function ipt(selector) {
          return btn(selector);
        }
        btn("#openfdialog").onclick = () => __async(null, null, function* () {
          let r = yield callWw2({
            openFileDialog: {
              filter: "",
              ownerClassName: "test"
            }
          });
          ipt("#ipt_dialog").value = r.result;
        });
        btn("#openfolder").onclick = () => __async(null, null, function* () {
          let r = yield callWw2({
            openFolderDialog: {
              filter: "",
              ownerClassName: "test"
            }
          });
          ipt("#ipt_dialog_folder").value = r.result;
        });
        btn("#close").onclick = () => __async(null, null, function* () {
          yield callWw2({
            controlWindow: {
              controlcmd: "close",
              wndClassName: "myuiclass"
            }
          });
        });
        btn("#move").onclick = () => __async(null, null, function* () {
          yield callWw2({
            controlWindow: {
              controlcmd: "move",
              wndClassName: "myuiclass",
              left: 100,
              top: 0
            }
          });
        });
        btn("#resize").onclick = () => __async(null, null, function* () {
          yield callWw2({
            controlWindow: {
              controlcmd: "resize",
              wndClassName: "myuiclass",
              width: 800,
              height: 700
            }
          });
        });
        btn("#max").onclick = () => __async(null, null, function* () {
          yield callWw2({
            controlWindow: {
              controlcmd: "maximize",
              wndClassName: "myuiclass"
            }
          });
        });
        btn("#min").onclick = () => __async(null, null, function* () {
          yield callWw2({
            controlWindow: {
              controlcmd: "minimize",
              wndClassName: "myuiclass"
            }
          });
        });
        btn("#testcamera").onclick = () => __async(null, null, function* () {
          const video = document.querySelector("#videoElement");
          let stream;
          video.style.display = "block";
          video.onclick = () => {
            const tracks = stream.getTracks();
            tracks.forEach((track) => {
              track.stop();
            });
            video.srcObject = null;
            video.style.display = "none";
          };
          if (navigator.mediaDevices.getUserMedia) {
            try {
              stream = yield navigator.mediaDevices.getUserMedia({ video: true });
              video.srcObject = stream;
            } catch (error) {
              console.error("Gagal mengakses kamera: ", error);
              alert("Kamera tidak diizinkan atau tidak ditemukan.");
            }
          } else {
            alert("Browser kamu tidak mendukung akses kamera.");
          }
        });
        btn("#testget").onclick = () => __async(null, null, function* () {
          let result = yield callVirtualDirFunction("getTest", "ini darai bwoser");
          console.log(result);
        });
      })();
    }
  });
  require_app_browser();
})();
//# sourceMappingURL=app_browser.js.map
