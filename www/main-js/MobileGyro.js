var socket = io('<your website>');
 

var cylinder = null;
var newx = 0;
var newy = 0;
var newz = 0;

var lastx = 0;
var lasty = 0;
var lastz = 0;

var _viewer = null;

function MobileGyroExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);

}

MobileGyroExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MobileGyroExtension.prototype.constructor = MobileGyroExtension;

MobileGyroExtension.prototype.load = function() {
    console.log('MobileGyroExtension.prototype.load');
    _viewer = this.viewer;
    this._OnOff = true;
    return true;
};

MobileGyroExtension.prototype.unload = function() {
    this._OnOff = false;
    return true;
};

MobileGyroExtension.prototype.OnOrOff = function() {

      if(this._OnOff)
      {
          cylinder = null;
          newx = 0;
          newy = 0;
          newz = 0;

          lastx = 0;
          lasty = 0;
          lastz = 0;

          //draw a cylinder
          var geometry_cylinder = new THREE.CylinderGeometry( 5, 10, 10, 32 );
          var material_cylinder= new THREE.MeshBasicMaterial( {color: 0xffff00} );
          cylinder = new THREE.Mesh( geometry_cylinder, material_cylinder );
          _viewer.impl.scene.add(cylinder);
          _viewer.impl.invalidate(true);

          //hard-coded the initial position of the cylinder
          cylinder.translateX( 0 );
          cylinder.translateY( 0 );
          cylinder.translateZ( 30 );
          cylinder.rotateX( 1.57 );

          socket.on('au_Gyro', function (msg) {
              var GyroJson = eval("(" + msg + ")");

             //element ID has not been used by this demo yet. reserve for future
              var windowNum = GyroJson.windowNum;
              //Gyro data
              var GyroData = GyroJson.GyroData;

              newx = GyroData.alpha;
              newy = GyroData.beta;
              newz = GyroData.gamma;

              console.log('x=' + newx + ' ' + 'y=' + newy + 'z=' + newz);

              //move the pbject
              cylinder.translateX(newx - lastx);
              cylinder.translateY(newy - lasty);
              cylinder.translateZ(newz - lastz);

              _viewer.impl.invalidate(true);
              lastx = newx;
              lasty = newy;
              lastz = newz;
          } );
      }
      else
      {
          //remove the cylinder
          _viewer.impl.scene.remove(cylinder);
          _viewer.impl.invalidate(true);
          //remove the listeners
          socket.removeAllListeners("au_Gyro");
      }
     this._OnOff = !this._OnOff;
}

Autodesk.Viewing.theExtensionManager.registerExtension('MobileGyroExtension', MobileGyroExtension);