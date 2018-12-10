let canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('rgb(255,255,255)');
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 3;
camera.position.z = 0.1;

var controls = new THREE.OrbitControls( camera );
camera.position.set( 0, 4, 2 );
controls.update();

const floorDefaults = {
  length:15,
  depth: 0.1,
  width: 15
}

const wallDefaults = {
  length: 4,
  depth: 0.1,
  width: 15
}

const tableDefaults = {
  length: 3.57,
  lengthOffset: 0.1,
  width: 1.78,
  widthOffset: 0.2,
  depth: 0.2,
  yPosition: 0.86,
  sideLength: 0.2,
  sideWidth: 3.57,
  sideDepth: 0.1
};

const ballDefaults = {
  radius: 0.1,
  widthSegments: 16,
  heightSegments: 16
};

let spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 0, 3.5, 0 );
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 100;
spotLight.distance = 100;
spotLight.angle = Math.PI/2 + Math.PI/4;
spotLight.target.position.set(-1, 0, 1 );
//spotLight.shadow.camera.fov = 30;
//spotLight.shadowDarkness = 0.95;
spotLight.intensity = 1.5;
scene.add( spotLight );

const txtLoader = new THREE.TextureLoader();

let table;

const floorTexture = txtLoader.load("Skins/floor.jpg");
let floorGeometry = new THREE.BoxGeometry( floorDefaults.length, floorDefaults.depth, floorDefaults.width);
let floorMaterial = new THREE.MeshPhongMaterial( { map:txtLoader.load("Skins/floor.jpg")});
let floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.castShadow = true;
floor.receiveShadow = true;
scene.add( floor );

let ceilingGeometry = new THREE.BoxGeometry( floorDefaults.length, floorDefaults.depth, floorDefaults.width);
let ceilingMaterial = new THREE.MeshPhongMaterial( {color: 0xA52A2A} );
let ceiling = new THREE.Mesh( ceilingGeometry, ceilingMaterial );
ceiling.castShadow = true;
ceiling.receiveShadow = true;
ceiling.position.set( 0, wallDefaults.length, 0);
scene.add( ceiling );

let wallLeftGeometry = new THREE.BoxGeometry( wallDefaults.length, wallDefaults.depth, wallDefaults.width);
let wallLeftMaterial = new THREE.MeshBasicMaterial( {color: 0xB9BD96, map:txtLoader.load("Skins/wall.jpg")});
let wallLeft = new THREE.Mesh( wallLeftGeometry, wallLeftMaterial );
wallLeft.rotation.set( 0, 0, Math.PI/2);
wallLeft.position.set( floorDefaults.length/2, wallDefaults.length/2, 0);
scene.add( wallLeft );

let wallRightGeometry = new THREE.BoxGeometry( wallDefaults.length, wallDefaults.depth, wallDefaults.width);
let wallRightMaterial = new THREE.MeshBasicMaterial( {color: 0xB9BD96, map:txtLoader.load("Skins/wall.jpg")});
let wallRight = new THREE.Mesh( wallRightGeometry, wallRightMaterial );
wallRight.rotation.set( 0, 0, Math.PI/2);
wallRight.position.set( -floorDefaults.length/2, wallDefaults.length/2, 0);
scene.add( wallRight );

let wallTopGeometry = new THREE.BoxGeometry( wallDefaults.length, wallDefaults.depth, wallDefaults.width);
let wallTopMaterial = new THREE.MeshBasicMaterial( {color: 0xB9BD96, map:txtLoader.load("Skins/wall.jpg")});
let wallTop = new THREE.Mesh( wallTopGeometry, wallTopMaterial );
wallTop.rotation.set( 0, Math.PI/2, Math.PI/2);
wallTop.position.set( 0, wallDefaults.length/2, floorDefaults.length/2);
scene.add( wallTop );

let wallBottomGeometry = new THREE.BoxGeometry( wallDefaults.length, wallDefaults.depth, wallDefaults.width);
let wallBottomMaterial = new THREE.MeshBasicMaterial( {color: 0xB9BD96, map:txtLoader.load("Skins/wall.jpg")});
let wallBottom = new THREE.Mesh( wallBottomGeometry, wallBottomMaterial );
wallBottom.rotation.set( 0, Math.PI/2, Math.PI/2);
wallBottom.position.set( 0, wallDefaults.length/2, -floorDefaults.length/2);
scene.add( wallBottom );

//---------------------------------------------------------------------------------------------------------
var platforms = [],
platformSize = 20,
platformWidth = 3.58/2 - 0.2,
platformHeight = 1.57/2 - 0.2;

function generatePlatforms(k) {
  var placed = 0,
  maxAttempts = k*10;
  while(placed < k && maxAttempts > 0) {
    var x = Math.random()*platformWidth,
    y = Math.random()*platformHeight,
    available = true;
    //console.log(platforms);
    for(let i=0; i<platforms.length; i++) {//for(var point in platforms) {
      console.log("x + " + Math.abs(platforms[i].y +y));
      console.log("y + " + Math.abs(platforms[i].x +x));
      console.log("x random + " + y);
      console.log("y random + " + x );
      if(Math.abs(platforms[i].x - x) < platformSize && Math.abs(platforms[i].y - y) < platformSize) {
        available = false;
        break;
      }
    }
    if(available) {
      x = (x) * (Math.random() >= 0.5 ? -1 : 1 );
      y = (y) * (Math.random() >= 0.5 ? -1 : 1 );
      platforms.push({
        x: x,
        y: y
      });
      placed += 1;
    }
    maxAttempts -= 1;
  }

  for(let j = 0; j < platforms.length; j++) {
    const txtLoader = new THREE.TextureLoader();
    var geometryBall8 = new THREE.SphereGeometry( ballDefaults.radius, ballDefaults.widthSegments, ballDefaults.heightSegments );
    let str = "PoolBallSkins/Ball"+ (j +8) +".jpg";
    const ball8Texture = txtLoader.load(str);
    var materialBall8 = new THREE.MeshBasicMaterial( {color: 0xffffff, map:ball8Texture} );
    var ball8 = new THREE.Mesh( geometryBall8, materialBall8 );
    ball8.position.set( platforms[j].x,tableDefaults.yPosition + tableDefaults.depth/2 + ballDefaults.radius, platforms[j].y);
    ball8.castShadow = true;
    ball8.receiveShadow = true;
    scene.add( ball8 );
  }
}

//generatePlatforms(8);
//console.log(platforms);
createTable();

generatePlatforms(8);
//---------------------------------------------------------------------------------------------------------

var geometryBall8 = new THREE.SphereGeometry( 0.3, 16, 16);
var materialBall8 = new THREE.MeshBasicMaterial( {color: 0xffffff, map: txtLoader.load("Skins/lamp.jpg")} );
var  lamp = new THREE.Mesh( geometryBall8, materialBall8 );
lamp.position.y = 3.5;
scene.add( lamp );

let wireLampGeometry = new THREE.BoxGeometry( 0.01, 0.5, 0.01   );
let wireLampMaterial = new THREE.MeshPhongMaterial( {color: 0x808080} );
let wireLamp = new THREE.Mesh( wireLampGeometry, wireLampMaterial );
wireLamp.position.y = 4;
scene.add( wireLamp );

function createTable () {

  let tableGeometry = new THREE.BoxGeometry( tableDefaults.length, tableDefaults.depth, tableDefaults.width);
  let tableMaterial = new THREE.MeshLambertMaterial( {color: 0x25eb78} );
  table = new THREE.Mesh( tableGeometry, tableMaterial );
  table.position.y = tableDefaults.yPosition;
  table.castShadow = true;
  //table.receiveShadow = true;
  scene.add( table );

  let bottomSideGeometry = new THREE.BoxGeometry( tableDefaults.sideWidth  + tableDefaults.widthOffset, tableDefaults.sideLength + tableDefaults.lengthOffset, tableDefaults.sideDepth );
  let bottomSideMaterial = new THREE.MeshStandardMaterial( {color: 0xD2691E} );
  let bottomSide = new THREE.Mesh( bottomSideGeometry, bottomSideMaterial );
  bottomSide.position.set(0,tableDefaults.yPosition , tableDefaults.width/2 + tableDefaults.sideDepth/2);
  bottomSide.castShadow = true;
  //bottomSide.receiveShadow = true;
  scene.add( bottomSide );

  let topSideGeometry = new THREE.BoxGeometry( tableDefaults.sideWidth  + tableDefaults.widthOffset, tableDefaults.sideLength + tableDefaults.lengthOffset, tableDefaults.sideDepth );
  let topSideMaterial = new THREE.MeshStandardMaterial( {color: 0xD2691E} );
  let topSide = new THREE.Mesh( topSideGeometry, topSideMaterial );
  topSide.position.set(0, tableDefaults.yPosition , - tableDefaults.width/2 - tableDefaults.sideDepth/2);
  topSide.castShadow = true;
  //  topSide.receiveShadow = true;
  scene.add( topSide );

  let rightSideGeometry = new THREE.BoxGeometry( tableDefaults.width, tableDefaults.sideLength + tableDefaults.lengthOffset, tableDefaults.sideDepth );
  let rightSideMaterial = new THREE.MeshStandardMaterial( {color: 0xD2691E} );
  let rightSide = new THREE.Mesh( rightSideGeometry, rightSideMaterial );
  rightSide.position.set( - tableDefaults.length/2 - tableDefaults.sideDepth/2, tableDefaults.yPosition, 0);
  rightSide.rotation.y = Math.PI/2;
  rightSide.castShadow = true;
  //  rightSide.receiveShadow = true;
  scene.add( rightSide );

  let leftSideGeometry = new THREE.BoxGeometry( tableDefaults.width, tableDefaults.sideLength + tableDefaults.lengthOffset, tableDefaults.sideDepth );
  let leftSideMaterial = new THREE.MeshStandardMaterial( {color: 0xD2691E} );
  let leftSide = new THREE.Mesh( leftSideGeometry, leftSideMaterial );
  leftSide.position.set( tableDefaults.length/2 + tableDefaults.sideDepth/2, tableDefaults.yPosition, 0);
  leftSide.rotation.y = Math.PI/2;
  leftSide.castShadow = true;
  //  leftSide.receiveShadow = true;
  scene.add( leftSide );

  let leftTopLegGeometry = new THREE.BoxGeometry( 0.1, tableDefaults.yPosition, 0.1   );
  let leftTopLegMaterial = new THREE.MeshStandardMaterial( {color: 0xD2691E} );
  let leftTopLeg = new THREE.Mesh( leftTopLegGeometry, leftTopLegMaterial );
  leftTopLeg.position.set(- tableDefaults.length/2, tableDefaults.yPosition/2 , -tableDefaults.width/2);
  leftTopLeg.castShadow = true;
  //  leftTopLeg.receiveShadow = true;
  scene.add( leftTopLeg );

  let leftBottomLegGeometry = new THREE.BoxGeometry( 0.1, tableDefaults.yPosition, 0.1   );
  let leftBottomLegMaterial = new THREE.MeshStandardMaterial( {color: 0xD2691E} );
  let leftBottomLeg= new THREE.Mesh( leftBottomLegGeometry, leftBottomLegMaterial );
  leftBottomLeg.position.set(- tableDefaults.length/2,tableDefaults.yPosition/2 , tableDefaults.width/2);
  leftBottomLeg.castShadow = true;
  //  leftBottomLeg.receiveShadow = true;
  scene.add( leftBottomLeg );

  let rightTopLegGeometry = new THREE.BoxGeometry( 0.1, tableDefaults.yPosition, 0.1   );
  let rightTopLegMaterial = new THREE.MeshStandardMaterial( {color: 0xD2691E} );
  let rightTopLeg = new THREE.Mesh( rightTopLegGeometry, rightTopLegMaterial );
  rightTopLeg.position.set( tableDefaults.length/2,tableDefaults.yPosition/2 , -tableDefaults.width/2);
  rightTopLeg.castShadow = true;
  //  rightTopLeg.receiveShadow = true;
  scene.add( rightTopLeg );

  let rightBottomLegGeometry = new THREE.BoxGeometry( 0.1, tableDefaults.yPosition, 0.1   );
  let rightBottomLegMaterial = new THREE.MeshStandardMaterial( {color: 0xD2691E} );
  let rightBottomLeg = new THREE.Mesh( rightBottomLegGeometry, rightBottomLegMaterial );
  rightBottomLeg.position.set( tableDefaults.length/2,tableDefaults.yPosition/2 , tableDefaults.width/2);
  rightBottomLeg.castShadow = true;
  //  rightBottomLeg.receiveShadow = true;
  scene.add( rightBottomLeg );
}
balls();

function balls() {
  /*//const txtLoader = new THREE.TextureLoader();

  var geometryBall8 = new THREE.SphereGeometry( ballDefaults.radius, ballDefaults.widthSegments, ballDefaults.heightSegments );
  const ball8Texture = txtLoader.load("PoolBallSkins/Ball8.jpg");
  var materialBall8 = new THREE.MeshBasicMaterial( {color: 0xffffff, map:ball8Texture} );
  var ball8 = new THREE.Mesh( geometryBall8, materialBall8 );
  ball8.position.set( 0,tableDefaults.yPosition + tableDefaults.depth/2 + ballDefaults.radius, 0);
  ball8.castShadow = true;
  ball8.receiveShadow = true;
  scene.add( ball8 );

  var geometryBall9 = new THREE.SphereGeometry( ballDefaults.radius, ballDefaults.widthSegments, ballDefaults.heightSegments );
  const ball9Texture = txtLoader.load("PoolBallSkins/Ball9.jpg");
  var materialBall9 = new THREE.MeshBasicMaterial( {color: 0xffffff, map:ball9Texture} );
  var ball9 = new THREE.Mesh( geometryBall9, materialBall9 );
  ball9.position.set( 0.1,tableDefaults.yPosition + tableDefaults.depth/2 + ballDefaults.radius, 0);
  ball9.castShadow = true;
  ball9.receiveShadow = true;
  scene.add( ball9 );

  var geometryBall10 = new THREE.SphereGeometry( ballDefaults.radius, ballDefaults.widthSegments, ballDefaults.heightSegments );
  const ball10Texture = txtLoader.load("PoolBallSkins/Ball10.jpg");
  var materialBall10 = new THREE.MeshBasicMaterial( {color: 0xffffff, map:ball10Texture} );
  var ball10 = new THREE.Mesh( geometryBall10, materialBall10 );
  ball10.position.set( 0.2,tableDefaults.yPosition + tableDefaults.depth/2 + ballDefaults.radius, 0);
  scene.add( ball10 );

  var geometryBall11 = new THREE.SphereGeometry( ballDefaults.radius, ballDefaults.widthSegments, ballDefaults.heightSegments );
  const ball11Texture = txtLoader.load("PoolBallSkins/Ball11.jpg");
  var materialBall11 = new THREE.MeshBasicMaterial( {color: 0xffffff, map:ball11Texture} );
  var ball11 = new THREE.Mesh( geometryBall11, materialBall11 );
  ball11.position.set( 0.3,tableDefaults.yPosition + tableDefaults.depth/2 + ballDefaults.radius, 0);
  scene.add( ball11 );

  var geometryBall12 = new THREE.SphereGeometry( ballDefaults.radius, ballDefaults.widthSegments, ballDefaults.heightSegments );
  const ball12Texture = txtLoader.load("PoolBallSkins/Ball12.jpg");
  var materialBall12 = new THREE.MeshBasicMaterial( {color: 0xffffff, map:ball12Texture} );
  var ball12 = new THREE.Mesh( geometryBall12, materialBall12 );
  ball12.position.set( 0.4,tableDefaults.yPosition + tableDefaults.depth/2 + ballDefaults.radius, 0);
  scene.add( ball12 );

  var geometryBall13 = new THREE.SphereGeometry( ballDefaults.radius, ballDefaults.widthSegments, ballDefaults.heightSegments );
  const ball13Texture = txtLoader.load("PoolBallSkins/Ball13.jpg");
  var materialBall13 = new THREE.MeshBasicMaterial( {color: 0xffffff, map:ball13Texture} );
  var ball13 = new THREE.Mesh( geometryBall13, materialBall13 );
  ball13.position.set( 0.5,tableDefaults.yPosition + tableDefaults.depth/2 + ballDefaults.radius, 0);
  scene.add( ball13 );

  var geometryBall14 = new THREE.SphereGeometry( ballDefaults.radius, ballDefaults.widthSegments, ballDefaults.heightSegments );
  const ball14Texture = txtLoader.load("PoolBallSkins/Ball14.jpg");
  var materialBall14 = new THREE.MeshBasicMaterial( {color: 0xffffff, map:ball14Texture} );
  var ball14 = new THREE.Mesh( geometryBall14, materialBall14 );
  ball14.position.set( -0.1,tableDefaults.yPosition + tableDefaults.depth/2 + ballDefaults.radius, 0);
  scene.add( ball14 );

  var geometryBall15 = new THREE.SphereGeometry( ballDefaults.radius, ballDefaults.widthSegments, ballDefaults.heightSegments );
  const ball15Texture = txtLoader.load("PoolBallSkins/Ball15.jpg");
  var materialBall15 = new THREE.MeshBasicMaterial( {color: 0xffffff, map:ball15Texture} );
  var ball15 = new THREE.Mesh( geometryBall15, materialBall15 );
  ball15.position.set(- 0.2,tableDefaults.yPosition + tableDefaults.depth/2 + ballDefaults.radius, 0);
  scene.add( ball15 );*/
}
//const controls = new THREE.TrackballControls( camera, canvas );
//controls.rotateSpeed = 2;

function render() {
  requestAnimationFrame(render);

  controls.update();
  renderer.render(scene, camera);
}

render();
