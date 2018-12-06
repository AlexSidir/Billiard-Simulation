let canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('rgb(255,255,255)');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
camera.position.y = 10;

renderer.shadowMapEnabled = true;
const clockDefaults = {
  radius: 10,
  height: 1,
  radialSegments: 60,
  frame:1
};

  let geometryFrontSide = new THREE.CylinderGeometry( clockDefaults.radius-1, clockDefaults.radius, clockDefaults.height/2, clockDefaults.radialSegments );
  let materialFrontSide = new THREE.MeshPhongMaterial( {color: 0x0000000} );
  let cylinderFrontSide = new THREE.Mesh( geometryFrontSide, materialFrontSide );
  cylinderFrontSide.position.y += clockDefaults.height;
  cylinderFrontSide.rotation.set( 0, Math.PI,0);
  scene.add( cylinderFrontSide );


  let length = 1, width = 1;

  let shape = new THREE.Shape();
  shape.moveTo( 0,0 );
  shape.lineTo( 0, width );
  shape.lineTo( length, width );
  shape.lineTo( length, 0 );
  shape.lineTo( 0, 0 );

  let extrudeSettings = {
    steps: 1,
    depth: 2,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 1
  };
  let group = new THREE.Group();

  //let geometry1 = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  //let material1 = new THREE.MeshPhongMaterial( { color: 0xFF0000 } );
//  let mesh1 = new THREE.Mesh( geometry1, material1 ) ;
//  mesh1.position.y = 5;
//  group.add( mesh1 );

//  scene.add(group);

  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 0, 10,0 );

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  spotLight.shadowCameraVisible = true;
	spotLight.shadowDarkness = 0.95;
	spotLight.intensity = 2;

  scene.add( spotLight );

  var sphereGeometry = new THREE.SphereGeometry( 10, 16, 8 );
	var darkMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );

	var wireframeMaterial = new THREE.MeshBasicMaterial(
		{ color: 0xffff00, wireframe: true, transparent: true } );
	var shape1 = THREE.SceneUtils.createMultiMaterialObject(sphereGeometry, [ darkMaterial, wireframeMaterial ] );
	//shape1.position.y = 10;
	scene.add( shape );


const controls = new THREE.TrackballControls( camera, canvas );
controls.rotateSpeed = 2;

function render() {
  requestAnimationFrame(render);

  controls.update();
  renderer.render(scene, camera);
}

render();
