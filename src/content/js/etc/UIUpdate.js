// The queue of upload requests for files.
var uploadq = [];
// The upload queue monitor used for locking.
var uploading = false;
// Processes the queue of pending uploads.
function processUploadq() {
    if (uploading) return;
    var upload = uploadq.shift();
    if (upload) {
        uploading = true;
	    gss.uploadFile(upload.file, upload.folder, upload.onstart,
	        upload.onprogress, upload.onload, upload.onerror, upload.onabort);
    } else
        uploading = false;
}
setInterval(processUploadq, 300);
// The queue of download requests for files.
var downloadq = [];
// The download queue monitor used for locking.
var downloading = false;
// Processes the queue of pending downloads.
function processDownloadq() {
    if (downloading) return;
    var download = downloadq.shift();
    if (download) {
        try {
            downloading = true;
            var now = (new Date()).toUTCString();
           	// Unfortunately single quotes are not escaped by default.
            var resource = download.file.uri.replace(/'/g, "%27");
            var authHeader = "Authorization: " + gss.username + " " +
                gss.sign('GET', now, resource, gss.authToken);
            var dateHeader = "X-GSS-Date: " + now;
            var headers = authHeader + "\r\n" + dateHeader + "\r\n";
		    var nsIURI = gIos.newURI(resource, "utf-8", null);
		    var result = download.persist.saveURI(nsIURI, null, null, null, headers, download.nsIFile);
		    if (result)
		        alert(result);
        } catch (e) {
            alert(e);
        }
    } else
        downloading = false;
}
setInterval(processDownloadq, 300);

window.setInterval("UIUpdate()", 500);                                             // update once a second

function UIUpdate() {
  if (gLogQueue && gLogMode) {
    var scrollLog = gCmdlogBody.scrollTop + 50 >= gCmdlogBody.scrollHeight - gCmdlogBody.clientHeight;
    gCmdlogBody.innerHTML += gLogQueue;                                             // update log

    gLogQueue = "";

    var nodeList = gCmdlogDoc.getElementsByTagName("div");                          // don't keep too much log data or it will slow down things
    var count    = 0;
    while (nodeList.length > 200 + count) {
      if (nodeList.item(count).getAttribute("type") == 'error') {
        ++count;
      } else {
        gCmdlogBody.removeChild(nodeList.item(count));
      }
    }

    if (scrollLog) {
      gCmdlogBody.scrollTop = gCmdlogBody.scrollHeight - gCmdlogBody.clientHeight;  // scroll to bottom
    }
  }

//  queueTree.updateView();                                                           // update queue

  var bytesTotal;                                                                   // update status bar
  var bytesTransferred;
  var bytesPartial;
  var timeStart;

  for (var x = 0; x < gMaxCon; ++x) {
    if (!gConnections[x].isConnected) {
      continue;
    }

    if (gConnections[x].dataSocket && gConnections[x].dataSocket.progressEventSink.bytesTotal && !gConnections[x].dataSocket.progressEventSink.compressStream) {
      bytesTotal       = gConnections[x].dataSocket.progressEventSink.bytesTotal;
      bytesTransferred = gConnections[x].dataSocket.progressEventSink.bytesUploaded;
      bytesPartial     = gConnections[x].dataSocket.progressEventSink.bytesPartial;
      timeStart        = gConnections[x].dataSocket.progressEventSink.timeStart;
      break;
    } else if (gConnections[x].dataSocket && gConnections[x].dataSocket.dataListener.bytesTotal) {
      bytesTotal       = gConnections[x].dataSocket.dataListener.bytesTotal;
      bytesTransferred = gConnections[x].dataSocket.dataListener.bytesDownloaded;
      bytesPartial     = gConnections[x].dataSocket.dataListener.bytesPartial;
      timeStart        = gConnections[x].dataSocket.dataListener.timeStart;
      break;
    }
  }

  if (bytesTotal) {
    gStatusBarClear   = false;
    var timeElapsed   = ((new Date()) - timeStart) / 1000;
    timeElapsed       = timeElapsed != 0 ? timeElapsed : 1;                         // no dividing by 0
    var averageRate   = ((bytesTransferred - bytesPartial) / 1024 / timeElapsed).toFixed(2);
    averageRate       = averageRate != 0 ? averageRate : "0.1";                     // no dividing by 0
    var timeRemaining = (bytesTotal - bytesTransferred) / 1024 * (1 / averageRate);
    averageRate       = averageRate.replace(/\./g, gStrbundle.getString("decimal")) + " " + gStrbundle.getString("kbsec");
    var filesleft     = 0;

    for (var x = 0; x < gMaxCon; ++x) {
      if (!gConnections[x].isConnected) {
        continue;
      }

      var filesleftTrans = 0;

      if (gConnections[x].dataSocket && gConnections[x].dataSocket.progressEventSink.bytesTotal) {
        filesleftTrans = gConnections[x].dataSocket.progressEventSink.bytesUploaded;
      } else if (gConnections[x].dataSocket && gConnections[x].dataSocket.dataListener.bytesTotal) {
        filesleftTrans = gConnections[x].dataSocket.dataListener.bytesDownloaded;
      }

      filesleft += filesleftTrans ? 1 : 0;
    }

    for (var x = 0; x < gMaxCon; ++x) {
      if (!gConnections[x].isConnected) {
        continue;
      }

      for (var y = 0; y < gConnections[x].eventQueue.length; ++y) {
        if (gConnections[x].eventQueue[y].cmd == "RETR" || gConnections[x].eventQueue[y].cmd == "APPE" || gConnections[x].eventQueue[y].cmd == "STOR") {
          ++filesleft;
        }
      }
    }

    gStatusBytes.label     = commas(bytesTransferred) + " / " + commas(bytesTotal) + ' - ' + gStrbundle.getFormattedString("filesleft", [filesleft]);
    var hours              = parseInt( timeElapsed / 3600);
    var min                = parseInt((timeElapsed - hours * 3600) / 60);
    var sec                = parseInt( timeElapsed - hours * 3600 - min * 60);
    gStatusElapsed.label   = zeros(hours) + ":" + zeros(min) + ":" + zeros(sec);

    hours                  = parseInt( timeRemaining / 3600);
    min                    = parseInt((timeRemaining - hours * 3600) / 60);
    sec                    = parseInt( timeRemaining - hours * 3600 - min * 60);
    gStatusRemaining.label = zeros(hours) + ":" + zeros(min) + ":" + zeros(sec);

    gStatusRate.label      = averageRate;
    var total              = bytesTotal != 0 ? bytesTotal : 1;                      // no dividing by 0
    var progress           = parseInt(bytesTransferred / total * 100) + "%";
    gStatusMeter.setAttribute("mode", "determined");
    gStatusMeter.setAttribute("value", progress);
    document.title         = progress + " @ " + averageRate + " - " + (gAccount ? gAccount : gFtp.host) + " - firegss";

  } else {
    var filesleft = 0;                                                              // update status bar to list how many files are left
    var status    = "";

    for (var x = 0; x < gMaxCon; ++x) {
      if (!gConnections[x].isConnected) {
        continue;
      }

      for (var y = 0; y < gConnections[x].eventQueue.length; ++y) {
        if (gConnections[x].eventQueue[y].cmd.indexOf("RETR") != -1 || gConnections[x].eventQueue[y].cmd.indexOf("APPE") != -1 || gConnections[x].eventQueue[y].cmd.indexOf("STOR") != -1
         || gConnections[x].eventQueue[y].cmd == "DELE" || gConnections[x].eventQueue[y].cmd == "RMD"
         || gConnections[x].eventQueue[y].cmd.indexOf("get") != -1 || gConnections[x].eventQueue[y].cmd.indexOf("put") != -1) {
          ++filesleft;
        }
      }
    }

    if (filesleft) {
      status = gStrbundle.getString("working") + ' - ' + gStrbundle.getFormattedString("filesleft", [filesleft]);
      gStatusMeter.setAttribute("mode", "undetermined");
      gStatusBarClear = false;
    } else if (gFtp.eventQueue.length) {
      status = gFtp.eventQueue[0].cmd == "welcome" ? gStrbundle.getString("connecting") : gStrbundle.getString("working");
      gStatusMeter.setAttribute("mode", "undetermined");
      gStatusBarClear = false;
    } else if (gProcessing) {
      status = gStrbundle.getString("working");
      gStatusMeter.setAttribute("mode", "undetermined");
      gStatusBarClear = false;
    } else if (!gStatusBarClear) {
      gStatusMeter.setAttribute("mode", "determined");
      gStatusBarClear = true;
    } else if (gStatusBarClear && !gFtp.isReconnecting) {
      return;
    }

//    if (!gFtp.isReconnecting && !gFtp.isConnected && !$('abortbutton').disabled) {
//      $('abortbutton').disabled = true;
//    }

    if (gFtp.isReconnecting) {
      if (gFtp.reconnectsLeft) {
        status = gStrbundle.getFormattedString("reconnect", [gFtp.reconnectInterval, gFtp.reconnectsLeft]);
        gStatusMeter.setAttribute("mode", "undetermined");
      } else {
        status = "";
        gStatusMeter.setAttribute("mode", "determined");
      }
    }

    gStatusBytes.label = status;

    if (!gFtp.isConnected) {
      document.title = (gFtp.isReconnecting ? (status + " - ") : "") + "firegss";
      gStatusBarClear = false;
    } else {
      document.title = status + (status == "" ? "" : " - ") + (gAccount ? gAccount : gFtp.host) + " - firegss";
    }

    gStatusElapsed.label   = "";
    gStatusRemaining.label = "";
    gStatusRate.label      = "";
    gStatusMeter.setAttribute("value", "0%");
  }
}
