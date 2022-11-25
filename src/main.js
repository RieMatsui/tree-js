// シーンが入っているかを確認
import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../jsm/controls/OrbitControls.js";
import { FontLoader } from "../jsm/loaders/FontLoader.js";
import { TextGeometry } from "../jsm/geometries/TextGeometry.js";

let scene, camera, renderer, pointLight, pointLightHelper, moonMesh, controls, text;

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
  let moonTexture = new THREE.TextureLoader().load("./textures/moon.png");

  // 地球のジオメトリを作成
  let ballGeometory = new THREE.SphereGeometry(100, 64, 32)

  // マテリアルを作成
  let ballMerial = new THREE.MeshPhysicalMaterial({ map: texture });

  // メッシュ化する
  let ballMesh = new THREE.Mesh(ballGeometory, ballMerial);
  scene.add(ballMesh);
  text = textRender();

  // 月のジオメトリを作成
  let moonGeometory = new THREE.SphereGeometry(20, 64, 32)

  // マテリアルを作成
  let moonMerial = new THREE.MeshPhysicalMaterial({ map: moonTexture });

  // メッシュ化する
  moonMesh = new THREE.Mesh(moonGeometory, moonMerial);
  scene.add(moonMesh);
  moonMesh.position.set(-200, -200, -200)

  text = textRender();

  createStarField();

  // 光原を追加
  let derectionalLight = new THREE.DirectionalLight(0xffffff, 2);
  derectionalLight.position.set(1, 1, 1);
  scene.add(derectionalLight);

  // ポイント光原を追加
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200)
  scene.add(pointLight);

  // ポイント光原を確認するためのヘルパーを作成
  // pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  // scene.add(pointLightHelper);

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


function textRender() {
  // ローダーのインスタンスをつくる
  const fontLoader = new FontLoader();

  // typeface.jsを読み込む
  return fontLoader.load('./fonts/Arial_Regular.json', (font) => {
    const textGeometry = new TextGeometry('Hello World', {
      font: font,
      size: 40,
      height: 10,
      curveSegments: 1,
      bevelEnabled: true,
      bevelSize: 2,
      bevelThickness: 1,
    });

    textGeometry.center();

    // 文字の色をランダムに変更する
    const textMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, overdraw: 0.5 });
    const text = new THREE.Line(textGeometry, textMaterial);

    scene.add(text);
    text.position.set(0, 0, 200);
    return text;
  });
}


function animate() {
  // 月を地球の周りを巡回させる
  moonMesh.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500),
  );
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

/**
* fragment
**/
function createStarField() {
  const geometry = new THREE.SphereBufferGeometry(1, 1, 1),
    size = 1;
  for (let i = 0; i < 1000; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(size * Math.random() - 0.5, size * Math.random() - 0.5, size * Math.random() - 0.5).normalize()
    mesh.position.multiplyScalar(Math.random() * 800)
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 1.5
    scene.add(mesh)
  }
}