import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry( 1,1,1);
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh ( geometry, material );
// scene.add ( cube );

const loader = new GLTFLoader();
let mixer;
let actions = {};

loader.load( './peeps/lady.glb', function ( gltf ) {

  const model = gltf.scene;
  model.scale.set(1,1,1);
  model.position.set(0,0,0);
  mixer = new THREE.AnimationMixer( model );

  gltf.animations.forEach( ( clip ) => {
    const action = mixer.clipAction( clip );
    actions[ clip.name ] = action;
    console.log('Loaded animation: ', clip.name);
    // action.play();
  });

  scene.add( model );

}, undefined, function ( error ) {

  console.error( error );

} );
// camera.position.z = 45;
const light = new THREE.AmbientLight( 0xffffff, 1.5 ); // soft white light
scene.add( light );
camera.position.set(-5, 175, 115);
camera.rotation.set(-0.15, 0, 0);

// const controls = new OrbitControls( camera, renderer.domElement );
// controls.target.set(0,20,0);
// controls.update();


const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render ( scene, camera );
  // cube.rotation.x += 0.01;
// cube.rotation.y += 0.01;
}

renderer.setAnimationLoop ( animate );



function playAnimation(name) {
  Object.values(actions).forEach(action => action.stop());
  actions[name].reset().play();
}

// playAnimation('smile');
