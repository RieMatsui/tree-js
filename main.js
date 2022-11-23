// シーンが入っているかを確認
import * as THREE from "./build/three.module.js";
import { OrbitControls } from "./jsm/controls/OrbitControls.js";

let scene, camera, renderer, pointLight, pointLightHelper, controls;

window.addEventListener("load", init);

window.addEventListener("resize", onWindowResize);

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, +500);

  // レンダラーを追加する
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);


  // テクスチャーを追加
  let texture = new THREE.TextureLoader().load("./textures/earth.jpg");

  // ジオメトリを作成
  let ballGeometory = new THREE.SphereGeometry(100, 64, 32)

  // マテリアルを作成
  let ballMerial = new THREE.MeshPhysicalMaterial({ map: texture });

  // メッシュ化する
  let ballMesh = new THREE.Mesh(ballGeometory, ballMerial);
  scene.add(ballMesh);

  // 光原を追加
  let derectionalLight = new THREE.DirectionalLight(0xffffff, 2);
  derectionalLight.position.set(1, 1, 1);
  scene.add(derectionalLight);

  // ポイント光原を追加
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200)
  scene.add(pointLight);

  // ポイント光原を確認するためのヘルパーを作成
  pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  // マウスで操作できるようにする
  controls = new OrbitControls(camera, renderer.domElement);
  animate();
}

//ブラウザのリサイズに対応させる
function onWindowResize() {
  // レンダラーのリサイズ
  renderer.setSize(window.innerWidth, window.innerHeight);

  // カメラのアスペクト比を変更
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}


function animate() {
  // ポイント光源を球の周りを巡回させる
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500),
  );
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}




