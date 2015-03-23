# Installation #

FireGSS can be installed either as a Firefox extension, or as a standalone application. The former case is suitable for people who use Firefox as their main browser, while the latter would be best for those who would rather not have Firefox installed in order to access the GSS service.

## Firefox extension ##

Installing the extension version is as simple as downloading the [latest XPI file](http://firegss.googlecode.com/files/firegss.xpi) from the [downloads](http://code.google.com/p/firegss/downloads/list) page. After downloading, open the file from Firefox (File -> Open File) and select Install from the installation dialog. Then restart Firefox as suggested, to complete the installation.

Firefox will then periodically check for updates to FireGSS and prompt for downloading them. In the update dialog, clicking Show Information can display the changes in the new version, that can be also seen in the ChangeLog.

Uninstalling the extension can be performed from the Tools -> Add-ons menu item. Select FireGSS from the list and click Uninstall.

## Standalone aplication ##

### Windows ###

In order to install the standalone version for Windows, first download the [latest MSI file](http://firegss.googlecode.com/files/FireGSS.msi) from the [downloads](http://code.google.com/p/firegss/downloads/list) page. After downloading, run the installer and it will copy the program files to disk, generate a Start menu entry and a desktop icon.

When a new version is released, running the new installer removes the current version and then installs the new one.

Uninstalling the application can be performed from the appropriate section of the Control Panel. You can also remove the profile data, stored in the \Users\username\AppData\Roaming\firegss directory on Vista, or \Documents and Settings\username\Application Data\firegss on Windows XP.

### Mac OS X ###

In order to install the standalone version for Mac, first download the [latest DMG file](http://firegss.googlecode.com/files/FireGSS.dmg) from the [downloads](http://code.google.com/p/firegss/downloads/list) page. After downloading, open the file and it will mount the DMG as a virtual drive, with a single FireGSS icon in it. Drag the icon to the Applications folder (or anywhere you wish) and it will get copied to your local disk. Unmount the virtual drive after copying has finished, by dragging the drive icon to the trash bin.

When a new version is released, download and mount the new DMG and then drag the FireGSS icon to the same installation folder. The installer will prompt to replace the current version with the new one.

Uninstalling the application can be performed by dragging the application icon from the Applications folder to the trash bin. You can also remove the profile data, stored in the ~/Library/Application Support/firegss directory.

### Linux ###

In order to install the standalone version for Linux, first download the [latest tar.bz2 file](http://firegss.googlecode.com/files/firegss-linux.tar.bz2) from the [downloads](http://code.google.com/p/firegss/downloads/list) page. After downloading, create a firegss folder somewhere appropriate, like your home directory, and extract the tar file in it. Launch the program by executing the firegss executable in that directory.

When a new version is released, download the new archive file, remove the contents of the firegss installation folder and then extract the new archive in it.

Uninstalling the application can be performed by deleting the firegss directory from your home directory. You can also remove the profile data, stored in the ~/.firegss directory.