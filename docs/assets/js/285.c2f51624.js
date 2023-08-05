(window.webpackJsonp=window.webpackJsonp||[]).push([[285],{556:function(t,e,o){"use strict";o.r(e);var r=o(14),n=Object(r.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("p",[t._v("https://medium.com/@Lola_Dam/packaging-pyqt-application-using-pyqtdeploy-for-both-linux-and-android-32ac7824708b")]),t._v(" "),e("p",[t._v("This article is a guide on building the "),e("em",[t._v("pyqt-demo")]),t._v(" application for both Linux and Android using "),e("a",{attrs:{href:"https://www.riverbankcomputing.com/software/pyqtdeploy/intro",target:"_blank",rel:"noopener noreferrer"}},[e("em",[t._v("pyqtdeploy")]),e("OutboundLink")],1),t._v(" tool.")]),t._v(" "),e("blockquote",[e("p",[t._v("It should also be possible to build Android applications on Windows and Linux but this isn’t tested. — Pyqt-demo README")])]),t._v(" "),e("h1",{attrs:{id:"prerequisite"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#prerequisite"}},[t._v("#")]),t._v(" Prerequisite")]),t._v(" "),e("p",[e("em",[t._v("It is assume that you have already installed python 3 and pip for this part.")])]),t._v(" "),e("p",[t._v("Pyqtdeploy is on pip so we can easily install it :")]),t._v(" "),e("p",[t._v("$ pip install pyqtdeploy")]),t._v(" "),e("p",[t._v("Now we need the "),e("code",[t._v("pyqt-demo")]),t._v(" code source. You can find it on the pip website. Download the source code and extract the demo folder : "),e("a",{attrs:{href:"https://pypi.org/project/pyqtdeploy/#files",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://pypi.org/project/pyqtdeploy/#files"),e("OutboundLink")],1)]),t._v(" "),e("p",[t._v("You should have the following structures :")]),t._v(" "),e("p",[t._v("."),e("br"),t._v("\n├── build-demo.py"),e("br"),t._v("\n├── data"),e("br"),t._v("\n│   └── "),e("strong",[t._v("init")]),t._v(".py"),e("br"),t._v("\n├── pyqt-demo.pdy"),e("br"),t._v("\n├── pyqt-demo.py"),e("br"),t._v("\n├── README"),e("br"),t._v("\n└── sysroot.json1 directory, 6 files")]),t._v(" "),e("p",[t._v("Now if we open "),e("code",[t._v("sysroot.json")]),t._v(" we will find that we need to download some libraries for our app and it might differ from platforms to platform. Like you might need "),e("code",[t._v("openssl-1.0.2r.tar.gz")]),t._v(" for android.")]),t._v(" "),e("p",[t._v("In order to speed up the process and not have to manually download everything. We can use this small script to download everything at once.")]),t._v(" "),e("p",[e("em",[t._v("download.sh")])]),t._v(" "),e("p",[t._v("wget "),e("a",{attrs:{href:"https://www.zlib.net/fossils/zlib-1.2.11.tar.gz",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.zlib.net/fossils/zlib-1.2.11.tar.gz"),e("OutboundLink")],1),e("br"),t._v("\nwget "),e("a",{attrs:{href:"http://download.qt.io/official_releases/qt/5.12/5.12.2/single/qt-everywhere-src-5.12.2.tar.xz",target:"_blank",rel:"noopener noreferrer"}},[t._v("http://download.qt.io/official_releases/qt/5.12/5.12.2/single/qt-everywhere-src-5.12.2.tar.xz"),e("OutboundLink")],1),e("br"),t._v("\nwget "),e("a",{attrs:{href:"https://www.python.org/ftp/python/3.7.2/Python-3.7.2.tar.xz",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.python.org/ftp/python/3.7.2/Python-3.7.2.tar.xz"),e("OutboundLink")],1),e("br"),t._v("\nwget "),e("a",{attrs:{href:"https://www.riverbankcomputing.com/static/Downloads/sip/4.19.15/sip-4.19.15.tar.gz",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.riverbankcomputing.com/static/Downloads/sip/4.19.15/sip-4.19.15.tar.gz"),e("OutboundLink")],1),e("br"),t._v("\nwget "),e("a",{attrs:{href:"https://www.riverbankcomputing.com/static/Downloads/PyQt5/5.12.1/PyQt5_gpl-5.12.1.tar.gz",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.riverbankcomputing.com/static/Downloads/PyQt5/5.12.1/PyQt5_gpl-5.12.1.tar.gz"),e("OutboundLink")],1),e("br"),t._v("\nwget "),e("a",{attrs:{href:"https://www.riverbankcomputing.com/static/Downloads/PyQt3D/5.12/PyQt3D_gpl-5.12.tar.gz",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.riverbankcomputing.com/static/Downloads/PyQt3D/5.12/PyQt3D_gpl-5.12.tar.gz"),e("OutboundLink")],1),e("br"),t._v("\nwget "),e("a",{attrs:{href:"https://www.riverbankcomputing.com/static/Downloads/PyQtChart/5.12/PyQtChart_gpl-5.12.tar.gz",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.riverbankcomputing.com/static/Downloads/PyQtChart/5.12/PyQtChart_gpl-5.12.tar.gz"),e("OutboundLink")],1),e("br"),t._v("\nwget "),e("a",{attrs:{href:"https://www.riverbankcomputing.com/static/Downloads/PyQtDataVisualization/5.12/PyQtDataVisualization_gpl-5.12.tar.gz",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.riverbankcomputing.com/static/Downloads/PyQtDataVisualization/5.12/PyQtDataVisualization_gpl-5.12.tar.gz"),e("OutboundLink")],1),e("br"),t._v("\nwget "),e("a",{attrs:{href:"https://www.riverbankcomputing.com/static/Downloads/PyQtPurchasing/5.12/PyQtPurchasing_gpl-5.12.tar.gz",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.riverbankcomputing.com/static/Downloads/PyQtPurchasing/5.12/PyQtPurchasing_gpl-5.12.tar.gz"),e("OutboundLink")],1),e("br"),t._v("\nwget "),e("a",{attrs:{href:"https://www.riverbankcomputing.com/static/Downloads/QScintilla/2.11.1/QScintilla_gpl-2.11.1.tar.gz",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.riverbankcomputing.com/static/Downloads/QScintilla/2.11.1/QScintilla_gpl-2.11.1.tar.gz"),e("OutboundLink")],1),e("br"),t._v("\nwget "),e("a",{attrs:{href:"https://ftp.openssl.org/source/old/1.0.2/openssl-1.0.2r.tar.gz",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://ftp.openssl.org/source/old/1.0.2/openssl-1.0.2r.tar.gz"),e("OutboundLink")],1)]),t._v(" "),e("p",[e("strong",[t._v("Notes")]),t._v(": Remember this is for Linux and Android. If you are using another platform you might want to verify the "),e("code",[t._v("sysroot.json")]),t._v(" file for "),e("code",[t._v("openssl")]),t._v(" version.")]),t._v(" "),e("h1",{attrs:{id:"linux"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#linux"}},[t._v("#")]),t._v(" Linux")]),t._v(" "),e("p",[t._v("We have basically everything needed to start building our demo app for Linux. It doesn’t get more complicated than that.")]),t._v(" "),e("p",[t._v("$ python build-demo.py --verbose")]),t._v(" "),e("p",[t._v("Using the "),e("code",[t._v("--verbose")]),t._v(" option will show the details of the build. It is not required but can help with understanding what is happening. The build will take time because it will build "),e("code",[t._v("Qt 5.12.2")]),t._v(" from source for us.")]),t._v(" "),e("p",[t._v("We notice also in the "),e("code",[t._v("sysroot.json")]),t._v(" that we can specify which modules to build and which to skip. It can really help to speed up the build time. You also obviously don’t need to rebuild it every time. Looking a bit more closely in the "),e("code",[t._v("build-demo.py")]),t._v(" file we realize that it execute several steps :")]),t._v(" "),e("ul",[e("li",[e("code",[t._v("pyqtdeploy-sysroot")])]),t._v(" "),e("li",[e("code",[t._v("pyqtdeploy-build")])]),t._v(" "),e("li",[e("code",[t._v("qmake")])]),t._v(" "),e("li",[e("code",[t._v("make")]),t._v(" or "),e("code",[t._v("nmake")]),t._v(" for windows")])]),t._v(" "),e("p",[t._v("Another file we can take a look at is the "),e("code",[t._v("pyqt-demo.pdy")]),t._v(" which is used in step 2. This file is actually auto generated by "),e("code",[t._v("pyqtdeploy")]),t._v(" .")]),t._v(" "),e("p",[t._v("$ pyqtdeploy pyqt-demo.pdy")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://miro.medium.com/v2/resize:fit:700/1*oZwrWD3WxLAPDcAPjDFsQQ.png",alt:""}})]),t._v(" "),e("p",[t._v("pyqtdeploy GUI tool")]),t._v(" "),e("p",[t._v("This tool will generate a "),e("code",[t._v(".pdy")]),t._v(" for you and help you include all the files needed for your application. You can find more details in the "),e("a",{attrs:{href:"https://www.riverbankcomputing.com/static/Docs/pyqtdeploy/pyqtdeploy.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("official documentation"),e("OutboundLink")],1),t._v(". For now, we don’t need to modify this as we already have our project file.")]),t._v(" "),e("p",[t._v("We have reviewed the basic components of a "),e("code",[t._v("pyqtdeploy")]),t._v(" project. I recommend you keep exploring the 3 files we mentioned to understand a little bit more the structure.")]),t._v(" "),e("h1",{attrs:{id:"android"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#android"}},[t._v("#")]),t._v(" Android")]),t._v(" "),e("p",[t._v("Building for Android might be a little bit more tricky and requires extra tools and libraries. The official documentation lacks a bit of information on this. This section will try to complete the official tutorial in particular for people who might have never done Android development like me.")]),t._v(" "),e("h2",{attrs:{id:"android-studio"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#android-studio"}},[t._v("#")]),t._v(" Android Studio")]),t._v(" "),e("p",[t._v("First step would be to install "),e("a",{attrs:{href:"https://developer.android.com/studio",target:"_blank",rel:"noopener noreferrer"}},[t._v("Android Studio"),e("OutboundLink")],1),t._v(". We don’t need the full IDE for android development but it will install all the tools we want and offer an easy to use interface to download the libraries needed. Also you will have an emulator installed for testing your "),e("code",[t._v(".apk")]),t._v(" package in case you don’t have an android device on which to test your app.")]),t._v(" "),e("h2",{attrs:{id:"installing-android-sdk"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#installing-android-sdk"}},[t._v("#")]),t._v(" Installing Android SDK")]),t._v(" "),e("p",[t._v("I have a device (tablet Nexus 9) running Android Nougat (7.1.1) so I am going to build for it.")]),t._v(" "),e("p",[t._v("Open Android Studio and click on "),e("strong",[t._v("Configure")]),t._v(" ->"),e("strong",[t._v("Settings")])]),t._v(" "),e("p",[e("img",{attrs:{src:"https://miro.medium.com/v2/resize:fit:700/1*kofWBGKe6ehbHKcdjv8yKw.png",alt:""}})]),t._v(" "),e("p",[t._v("Welcome to Android Studio window")]),t._v(" "),e("p",[t._v("Now choose "),e("strong",[t._v("Android 7.0 (Nougat).")])]),t._v(" "),e("p",[e("img",{attrs:{src:"https://miro.medium.com/v2/resize:fit:700/1*cyGGvCraJYevMraXHw3snw.png",alt:""}})]),t._v(" "),e("p",[t._v("Android Studio Settings windows")]),t._v(" "),e("p",[t._v("Click on "),e("strong",[t._v("Apply")]),t._v(" to install the SDK.")]),t._v(" "),e("p",[e("em",[t._v("Note : Why didn’t I choose Android 7.1.1 (Nougat)? Unfortunately, I attempt to use it but always got an error message saying that my NDK wasn’t compatible with this version and that for several NDK version…")])]),t._v(" "),e("h2",{attrs:{id:"installing-our-android-ndk"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#installing-our-android-ndk"}},[t._v("#")]),t._v(" Installing our Android NDK")]),t._v(" "),e("p",[t._v("Because we are using "),e("strong",[t._v("Qt 5.12.2")]),t._v(" we need "),e("strong",[t._v("Android NDK 19c")]),t._v(" version. For some unknown reason the latest is not compatible.")]),t._v(" "),e("p",[t._v("You can download it from here : "),e("a",{attrs:{href:"https://developer.android.com/ndk/downloads/older_releases.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://developer.android.com/ndk/downloads/older_releases.html"),e("OutboundLink")],1)]),t._v(" "),e("p",[t._v("You can extract it in your "),e("code",[t._v("Android")]),t._v(" folder which should have been created in your user space and already has your "),e("code",[t._v("Sdk")]),t._v(" folder with the Android SDK with downloaded previously. You can create an "),e("code",[t._v("~/Android/Ndk")]),t._v(" folder.")]),t._v(" "),e("p",[t._v("lola@*******:~/Android/Ndk$ tree -L 1"),e("br"),t._v("\n."),e("br"),t._v("\n├── android-ndk-r19c"),e("br"),t._v("\n└── android-ndk-r20")]),t._v(" "),e("h2",{attrs:{id:"downloading-qt-5-12-2"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#downloading-qt-5-12-2"}},[t._v("#")]),t._v(" Downloading Qt 5.12.2")]),t._v(" "),e("p",[t._v("When building for Android, we are not going to build Qt 5.12 from source. Instead you will need to download it : "),e("a",{attrs:{href:"https://www.qt.io/download",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.qt.io/download"),e("OutboundLink")],1)]),t._v(" "),e("p",[t._v("You can install it in your user folder under (e.g "),e("code",[t._v("~/Qt/")]),t._v(" ). Be sure to remember the path we will need it.")]),t._v(" "),e("p",[t._v("Now be sure you have a folder named "),e("code",[t._v("android_armv7")]),t._v(" . It is the folder name specify in the "),e("code",[t._v("sysroot.json")]),t._v(" for Android target. In our case, it should be here "),e("code",[t._v("~/Qt/5.12.2/android_armv7")]),t._v(" .")]),t._v(" "),e("h2",{attrs:{id:"building-the-pyqt-demo-apk"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#building-the-pyqt-demo-apk"}},[t._v("#")]),t._v(" Building the pyqt-demo .apk")]),t._v(" "),e("p",[t._v("We have all the libraries needed to build the Android app.")]),t._v(" "),e("p",[t._v("$ ANDROID_NDK_ROOT=$HOME/Android/NDK/android-ndk-r19c ANDROID_NDK_PLATFORM=android-24 ANDROID_SDK_ROOT=$HOME/Android/Sdk python3 build-demo.py --verbose --target android --installed-qt-dir $HOME/Qt/5.12.2/")]),t._v(" "),e("p",[t._v("This little guide summarize the all process to create the PyQt demo application. One of the advantage of using PyQt is to be able to build for multiple platform app and unlike the more famous Electron it doesn’t ship an entire browser with it.")])])}),[],!1,null,null,null);e.default=n.exports}}]);