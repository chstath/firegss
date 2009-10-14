var sync;
if (!sync) sync = {};

sync.init = function () {
    if (gSyncFolder === "")
        showPreferences({ tab: 2, next: sync.checkPreconditions });
    else
        sync.checkPreconditions();
}

sync.checkPreconditions = function () {
    if (!gss.rootFolder.uri) {
        alert("You have to login first");
        return;
    }
    var found = false;
    gss.rootFolder.folders.forEach(function (elem) {
        if (elem.name === gRemoteSyncFolder)
            found = true;
    });
    if (!found) {
        // Create remote sync folder first.
        var callback = function(newFolder) {
            if (!newFolder)
                alert("Could not create " + gRemoteSyncFolder + " folder");
            else {
                remoteTree.updateView();
                for (var x = 0; x < remoteTree.rowCount; ++x) {
                  // XXX: val here should probably be newFolder
                  if (remoteTree.data[x].name == val) {
                    remoteTree.selection.select(x);
                    remoteTree.treebox.ensureRowIsVisible(x);
                    break;
                  }
                }
                sync.ensureCachedRemoteSync();
            }
        };
        gss.createFolder(gss.rootFolder, gRemoteSyncFolder, callback);
    }
    sync.ensureCachedRemoteSync();
}

sync.ensureCachedRemoteSync = function () {
    var remoteRoot;
    gss.rootFolder.folders.forEach(function (f) {
        if (f.name === gRemoteSyncFolder)
            remoteRoot = f;
    });
    // Assert the existence of .sync for now. In the future this code will be
    // refactored anyway.
    if (!remoteRoot) {
        alert("No remote .sync found");
        return;
    }
    // Find the remote sync folder that corresponds to the local sync folder.
    var localRoot = localFile.init(gSyncFolder);
    var start = function () {
        return function () {
            var found = false;
            remoteRoot.folders.forEach(function (f) {
                if (f.name === localRoot.leafName) {
                    remoteRoot = f;
                    found = true;
                }
            });
            if (!found)
                sync.upload(localRoot, remoteRoot);
            else
                sync.compareFolders(localRoot, remoteRoot);
            //sync.start({ found: found, localRoot: localRoot, remoteRoot: remoteRoot });
        };
    }();
    if (!remoteRoot.folders)
        gss.fetchFolderWithChildren(remoteRoot, start);//sync.start, { found: found,
            //localRoot: localRoot, remoteRoot: remoteRoot });
    else 
        start();
}

sync.start = function (args) {
    if (!args.found)
        sync.upload(args.localRoot, args.remoteRoot);
    else
        sync.compareFolders(args.localRoot, args.remoteRoot);
}

// Compare the local and remote folders.
sync.compareFolders = function (local, remote) {
    var diff = local.lastModifiedTime - remote.modificationDate;
    if (diff > 0)
        sync.compareChildren(local, remote, true, false);
    else if (diff < 0)
        sync.compareChildren(local, remote, false, true);
    else
        sync.compareChildren(local, remote);
}

// Compare the files and subfolders of a folder.
sync.compareChildren = function (local, remote, isLocalNewer, isRemoteNewer) {
    // First we fetch updates.
    // Check remote folders.
    if (remote.folders)    
        remote.folders.forEach(function (f) {
            // Find the relevant local folder.
            let localFolders = local.directoryEntries;
            let found = false;
            while (localFolders.hasMoreElements()) {
                let lf = localFolders.getNext().QueryInterface(Ci.nsILocalFile);
                if (lf.leafName === f.name && lf.isDirectory()) {
                    found = true;
                    sync.compareFolders(lf, f);
                    break;
                }
            }
            if (!found) {
                // TODO: download new remote folders only if not deleted locally
                let newFile = local.append(f.name);
                sync.download(newFile, f);
            }
        });        
    // Check remote files.
    if (remote.files)
        remote.files.forEach(function (f) {
            // Find the relevant local file.
            let localFiles = local.directoryEntries;
            let found = false;
            while (localFiles.hasMoreElements()) {
                let lf = localFiles.getNext().QueryInterface(Ci.nsILocalFile);
                if (lf.leafName === f.name && !lf.isDirectory()) {
                    found = true;
                    sync.compareFiles(lf, f);
                    break;
                }
            }
            if (!found) {
                // TODO: download new remote files only if not deleted locally
                let newFile = local.append(f.name);
                sync.download(newFile, f);
            }
        });
    // Then we push updates for new local files and folders.
    let localChildren = local.directoryEntries;
    while (localChildren.hasMoreElements()) {
        let lf = localChildren.getNext().QueryInterface(Ci.nsILocalFile);
        if (lf.isDirectory()) {
            // Check remote folders.
            let found = false;
            if (remote.folders)
                remote.folders.forEach(function (f) {
                    if (f.name === lf.leafName)
                        found = true;
                });
            if (!found)
                sync.upload(lf, remote);
        } else if (!lf.isSpecial()) {
            // Check remote files.
            let found = false;
            if (remote.files)
                remote.files.forEach(function (f) {
                    if (f.name === lf.leafName)
                        found = true;
                });
            if (!found)
                sync.upload(lf, remote);
        }
    }
}

sync.compareFiles = function (local, remote) {
    var diff = local.lastModifiedTime - remote.modificationDate;
    if (diff > 0)    
        sync.upload(local, remote.folder);                    
    else if (diff < 0)
        sync.download(local, remote);
}

// Uploads the specified local file or folder to the specified remote parent folder.
sync.upload = function (local, remoteParent) {
    var startUpload = function () {
        var t = new transfer();
        t.prompt = false;
        t.start(false, local, local.parent.path, remoteParent);
    };
    if (remoteParent.isFolder && !remoteParent.parent)
        gss.fetchFolderWithChildren(remoteParent, startUpload);
    else if (!remoteParent.isFolder && !remoteParent.folder)
        gss.fetchFile(remoteParent, startUpload);
    else 
        startUpload();
}

// Downloads the specified remote file or folder to the specified local file or folder.
sync.download = function (local, remote) {
    var startDownload = function () {
        var t = new transfer();
        t.prompt = false;
        t.start(true, '', local.parent.path, remote);
    };
    if (remote.isFolder && !remote.parent)
        gss.fetchFolderWithChildren(remote, startDownload);
    else if (!remote.isFolder && !remote.folder)
        gss.fetchFile(remote, startDownload);
    else 
        startDownload();
}
