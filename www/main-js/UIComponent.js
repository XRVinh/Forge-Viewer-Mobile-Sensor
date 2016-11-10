 var _gyroext = null;

function MyUIExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

MyUIExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MyUIExtension.prototype.constructor = MyUIExtension;

MyUIExtension.prototype.onToolbarCreated = function() {
    this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
};

MyUIExtension.prototype.createUI = function() {

    var viewer = this.viewer;
    // Button - Gyro
    var button_Gyro = new Autodesk.Viewing.UI.Button('gyro-button');
    button_Gyro.icon.style.fontSize = "24px";
    button_Gyro.icon.className = 'glyphicon glyphicon-link';

    this._isGyro = false;
    button_Gyro.onClick = function(e) {
        _gyroext.OnOrOff();
    };
    //button_Gyro.addClass('gyro-button');
    button_Gyro.setToolTip('Mobile Gyro');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-buttons-toolbar');
     this.subToolbar.addControl(button_Gyro);

    viewer.toolbar.addControl(this.subToolbar);
};

MyUIExtension.prototype.load = function() {

    var viewer = this.viewer;

    if (this.viewer.toolbar) {
        // Toolbar is already available, create the UI
        this.createUI();
        var options = {};
        _gyroext = new  MobileGyroExtension(viewer, options);
        _gyroext.load();
    } else {
        // Toolbar hasn't been created yet, wait until we get notification of its creation
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        this.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }

    return true;
};

MyUIExtension.prototype.unload = function() {

    this.viewer.toolbar.removeControl(this.subToolbar);

    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('MyUIExtension', MyUIExtension);