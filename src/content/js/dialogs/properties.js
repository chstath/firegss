var gInitialPermissions;
var gStrbundle;
var gArgs;

function init() {
  gStrbundle = $("strings");
  gArgs      = window.arguments[0];

  setTimeout("$('properties').getButton('accept').focus()", 0);

  if (gArgs.multipleFiles) {
    $('thumbrow').collapsed = true;
    multipleFiles();
    return;
  }

  $('path').value = gArgs.path;
  $('name').value = gArgs.leafName;
  $('date').value = gArgs.date;

  if (gArgs.recursiveFolderData) {
    $('size').value     = parseSize(gArgs.recursiveFolderData.nSize)
                        + (gArgs.recursiveFolderData.nSize > 1023 ? "  (" + gStrbundle.getFormattedString("bytes", [commas(gArgs.recursiveFolderData.nSize)]) + ")" : "");
    $('contains').value = gStrbundle.getFormattedString("files", [commas(parseInt(gArgs.recursiveFolderData.nFiles))]) + ", "
                        + gStrbundle.getFormattedString("folders", [commas(parseInt(gArgs.recursiveFolderData.nFolders))]);

    if (gArgs.applyTo && gArgs.applyTo.type) {
      $('thisprop').checked    = gArgs.applyTo.thisFile;
      $('foldersprop').checked = gArgs.applyTo.folders;
      $('filesprop').checked   = gArgs.applyTo.files;
    } else {
      $('multipleprops').collapsed = true;
    }
  } else {
    $('size').value              = parseSize(gArgs.fileSize) + (gArgs.fileSize > 1023 ? "  (" + gStrbundle.getFormattedString("bytes", [commas(gArgs.fileSize)]) + ")" : "");
    $('containsrow').collapsed   = true;
    $('multipleprops').collapsed = true;
  }

  if (gArgs.origPermissions) {
    $('readowner').checked   = gArgs.origPermissions.charAt(1) != '-';
    $('writeowner').checked  = gArgs.origPermissions.charAt(2) != '-';
    $('execowner').checked   = gArgs.origPermissions.charAt(3) != '-';
    $('readgroup').checked   = gArgs.origPermissions.charAt(4) != '-';
    $('writegroup').checked  = gArgs.origPermissions.charAt(5) != '-';
    $('execgroup').checked   = gArgs.origPermissions.charAt(6) != '-';
    $('readpublic').checked  = gArgs.origPermissions.charAt(7) != '-';
    $('writepublic').checked = gArgs.origPermissions.charAt(8) != '-';
    $('execpublic').checked  = gArgs.origPermissions.charAt(9) != '-';

    if (gArgs.origPermissions.charAt(3) == 's') {
      $('suid').checked      = true;
    }

    if (gArgs.origPermissions.charAt(3) == 'S') {
      $('suid').checked      = true;
      $('execowner').checked = false;
    }

    if (gArgs.origPermissions.charAt(6) == 's') {
      $('guid').checked      = true;
    }

    if (gArgs.origPermissions.charAt(6) == 'S') {
      $('guid').checked      = true;
      $('execgroup').checked = false;
    }

    if (gArgs.origPermissions.charAt(9) == 't') {
      $('sticky').checked     = true;
    }

    if (gArgs.origPermissions.charAt(9) == 'T') {
      $('sticky').checked     = true;
      $('execpublic').checked = false;
    }

    change();
    gInitialPermissions = $('manual').value;
    addEventListener("CheckboxStateChange", change, true);
  } else {
    $('permrow').collapsed = true;
  }

  if (gArgs.writable != 'disabled') {
    $('readonly').checked   = !gArgs.writable;
    $('hidden').checked     =  gArgs.hidden;
    $('readonly').disabled  =  gArgs.isLinuxType;
    $('hidden').disabled    =  true;
    $('userrow').collapsed  =  true;
    $('grouprow').collapsed =  true;
  } else {
    $('attrrow').collapsed  =  true;
    $('user').value         =  gArgs.user;
    $('group').value        =  gArgs.group;
  }

  if (gArgs.isDirectory) {
    $('fileIcon').setAttribute("class", "isFolder");
  } else if (gArgs.isSymlink) {
    $('fileIcon').setAttribute("class", "isLink");
  } else {
    $('fileIcon').src = "moz-icon://file:///" + gArgs.path + "?size=32";
  }

  if (gArgs.isSymlink) {
    $('path').value += " -> " + gArgs.symlink;
  }

  if (gArgs.recursiveFolderData == null && (gArgs.isLocal || gArgs.webHost)) {
    var leafName  = gArgs.leafName;
    var extension = leafName.lastIndexOf(".") != -1 ? leafName.substring(leafName.lastIndexOf(".") + 1, leafName.length).toLowerCase() : "";

    if (gArgs.webHost && gArgs.webHost.indexOf("http://") != 0) {
      gArgs.webHost = "http://" + gArgs.webHost;
    }

    var webPath = gArgs.path;
    if (gArgs.prefix && gArgs.path.indexOf(gArgs.prefix) == 0) {
      webPath = webPath.substring(gArgs.prefix.length);
    }

    if (gArgs.webHost) {
      $('webpath').value = gArgs.webHost + webPath;
    } else {
      $('webpathrow').collapsed = true;
    }

    if (extension == "jpg" || extension == "bmp" || extension == "gif" || extension == "jpeg" || extension == "jfif"
     || extension == "png" || extension == "jng" || extension == "xbm" || extension == "mng"  || extension == "jpe") {
      $('webbox').collapsed = true;
      $('thumbnail').setAttribute("src", (gArgs.isLocal ? ("file:///" + gArgs.path) : (gArgs.webHost + webPath)));
    } else if (extension == "html"  || extension == "htm" || extension == "shtml" || extension == "xml"  || extension == "xhtml" || extension == "wml"
            || extension == "svg"   || extension == "xul" || extension == "hdml" || extension == "dhtml" || extension == "mathml") {
      $('thumbrow').collapsed = true;

      // XXX: this has become broken since Firefox 2.0.0.5 - and I don't know how to work around it.  I'm open to ideas...

      //$('imagebox').collapsed = true;
      //var win = $('hiddenBrowser').contentWindow;
      //win.addEventListener("load", browserLoad, false);
      //setTimeout("browserLoad()", 1000);
      //$('hiddenBrowser').loadURI((gArgs.isLocal ? ("file:///" + gArgs.path) : (gArgs.webHost + webPath)), null, null);
    } else {
      $('thumbrow').collapsed = true;
    }
  } else {
    $('thumbrow').collapsed   = true;
    $('webpathrow').collapsed = true;
  }
}

function change() {
  $('manual').value = (4 * $('suid').checked       + 2 * $('guid').checked        + 1 * $('sticky').checked).toString()
                    + (4 * $('readowner').checked  + 2 * $('writeowner').checked  + 1 * $('execowner').checked).toString()
                    + (4 * $('readgroup').checked  + 2 * $('writegroup').checked  + 1 * $('execgroup').checked).toString()
                    + (4 * $('readpublic').checked + 2 * $('writepublic').checked + 1 * $('execpublic').checked).toString();
}

function doOK() {
  if ("returnVal" in gArgs) {
    gArgs.returnVal = true;
    gArgs.writable  = !$('readonly').checked;
  }

  if (!gInitialPermissions) {
    return true;
  }

  if (gArgs.multipleFiles) {
    gArgs.permissions       = $('manual').value;
    gArgs.applyTo.folders   = $('foldersprop').checked;
    gArgs.applyTo.files     = $('filesprop').checked;
  } else if (gInitialPermissions != $('manual').value || $('foldersprop').checked || $('filesprop').checked) {
    gArgs.permissions = $('manual').value;

    if (gArgs.applyTo) {
      gArgs.applyTo.thisFile = $('thisprop').checked;
      gArgs.applyTo.folders  = $('foldersprop').checked;
      gArgs.applyTo.files    = $('filesprop').checked;
    }
  }

  return true;
}

function multipleFiles() {
  $('pathrow').collapsed      = true;
  $('webpathrow').collapsed   = true;
  $('daterow').collapsed      = true;
  $('containsrow').collapsed  = true;
  $('userrow').collapsed      = true;
  $('grouprow').collapsed     = true;
  $('attrrow').collapsed      = true;
  $('thisprop').collapsed     = true;

  if (gArgs.recursiveFolderData.type == "remote") {
    change();
    gInitialPermissions = $('manual').value;
    addEventListener("CheckboxStateChange", change, true);

    $('foldersprop').checked = gArgs.applyTo.folders;
    $('filesprop').checked   = gArgs.applyTo.files;
  } else {
    $('permrow').collapsed = true;
  }

  $('fileIcon').setAttribute("class", "isMultiple");
  $('name').value = gStrbundle.getFormattedString("files", [commas(parseInt(gArgs.recursiveFolderData.nFiles))]) + ", "
                  + gStrbundle.getFormattedString("folders", [commas(parseInt(gArgs.recursiveFolderData.nFolders))]);
  $('size').value = parseSize(gArgs.recursiveFolderData.nSize)
                  + (gArgs.recursiveFolderData.nSize > 1023 ? "  (" + gStrbundle.getFormattedString("bytes", [commas(gArgs.recursiveFolderData.nSize)]) + ")": "");
}

