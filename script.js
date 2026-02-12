// --- 1. LENIS (Smooth Scroll) ---
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// --- 2. GSAP SCROLL & NAV ---
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
function scrollToSection(id) { gsap.to(window, { duration: 1.5, scrollTo: id, ease: "power3.inOut" }); }

// --- 3. LIGHTBOX ---
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(card) {
    const type = card.getAttribute('data-type');
    const src = card.getAttribute('data-src');
    
    // 1. RÉCUPÉRATION DES NOUVELLES INFOS
    const title = card.querySelector('h3').innerText;
    const softs = card.getAttribute('data-softs') || "Logiciel inconnu"; // Valeur par défaut si vide
    const date = card.getAttribute('data-date') || "Date inconnue";

    lightboxContent.innerHTML = '';
    
    // 2. CRÉATION DU CONTENEUR MÉDIA
    // On met le média dans une div pour pouvoir centrer le texte en dessous
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '15px';
    
    if (type === 'video') {
        const video = document.createElement('video'); 
        video.src = src; 
        video.controls = true; 
        video.autoplay = true; 
        video.style.maxWidth = '90vw';
        video.style.maxHeight = '80vh';
        video.style.borderRadius = '4px';
        video.style.boxShadow = '0 0 50px rgba(0,0,0,0.5)';
        wrapper.appendChild(video);
    } else {
        const img = document.createElement('img'); 
        img.src = src; 
        img.style.maxWidth = '90vw';
        img.style.maxHeight = '80vh';
        img.style.borderRadius = '4px';
        img.style.boxShadow = '0 0 50px rgba(0,0,0,0.5)';
        wrapper.appendChild(img);
    }

    // 3. CRÉATION DU BLOC TEXTE (TITRE + SOFTS + DATE)
    const infoDiv = document.createElement('div');
    infoDiv.style.textAlign = 'center';
    infoDiv.style.color = 'white';
    infoDiv.innerHTML = `
        <h2 style="margin: 0; font-size: 1.5rem; text-transform: uppercase; letter-spacing: 2px;">${title}</h2>
        <p style="margin: 5px 0 0; color: #aaa; font-size: 0.9rem; font-style: italic;">${softs}</p>
        <p style="margin: 0; color: #666; font-size: 0.8rem;">${date}</p>
    `;
    
    wrapper.appendChild(infoDiv);
    lightboxContent.appendChild(wrapper);

    // On efface l'ancien caption séparé s'il existe encore dans ton HTML
    if(lightboxCaption) lightboxCaption.innerText = ""; 

    lightbox.style.display = 'flex';
    gsap.to(lightbox, { opacity: 1, duration: 0.3 });
    lenis.stop();
}
function closeLightbox() {
    const activeVideo = lightboxContent.querySelector('video');
    if (activeVideo) { activeVideo.pause(); activeVideo.src = ""; }
    gsap.to(lightbox, { opacity: 0, duration: 0.3, onComplete: () => { lightbox.style.display = 'none'; lightboxContent.innerHTML = ''; } });
    lenis.start();
}
lightboxContent.addEventListener('click', (e) => e.stopPropagation());

// --- 4. FILTRAGE PROJETS ---
function filterProjects(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            if (card.style.display === 'none') {
                card.style.display = 'block';
                gsap.fromTo(card, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, clearProps: "all" });
            }
        } else {
            gsap.to(card, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => { card.style.display = 'none'; } });
        }
    });
}

// --- 5. ANIMATIONS DIVERSES ---
gsap.to(".soft-item", {
    scrollTrigger: { trigger: "#about", start: "top 70%", toggleActions: "play none none reverse" },
    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out"
});

gsap.to("#turbulence-noise", { attr: { baseFrequency: "0.001" }, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });

const card = document.getElementById('tilt-card');
card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const rotateX = ((e.clientY - rect.top - rect.height/2) / (rect.height/2)) * -5;
    const rotateY = ((e.clientX - rect.left - rect.width/2) / (rect.width/2)) * 5;
    card.style.transform = `perspective(1000px) scale(1.08) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});
card.addEventListener('mouseleave', () => { card.style.transform = `perspective(1000px) scale(1.05) rotateX(0) rotateY(0)`; });

// --- 7. BOUTON FLOTTANT ---
const floatingBtn = document.getElementById('floating-contact');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const winH = window.innerHeight;
    const docH = document.body.scrollHeight;

    if (scrollY > winH * 0.5 && scrollY < docH - winH * 1.5) {
        floatingBtn.style.opacity = '1'; 
        floatingBtn.style.transform = 'translateY(0) scale(1)'; 
        floatingBtn.style.pointerEvents = 'all';
    } else {
        floatingBtn.style.opacity = '0'; 
        floatingBtn.style.transform = 'translateY(20px) scale(1)'; 
        floatingBtn.style.pointerEvents = 'none';
    }
});

// =========================================================
// --- 8. THREE.JS : GALAXY ENGINE FINAL ---
// =========================================================

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.0005); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); 
document.getElementById('webgl-container').appendChild(renderer.domElement);

const galaxyGroup = new THREE.Group();
scene.add(galaxyGroup);

// --- PALETTES DE COULEURS ---
const palettes = [
    { base: new THREE.Color(0x0a1a3a), mid: new THREE.Color(0x8a00ff), high: new THREE.Color(0x00d4ff), bg: new THREE.Color(0x050518) },
    { base: new THREE.Color(0x052010), mid: new THREE.Color(0x00ff6a), high: new THREE.Color(0xccff00), bg: new THREE.Color(0x020f05) },
    { base: new THREE.Color(0x200505), mid: new THREE.Color(0xff0033), high: new THREE.Color(0xffaa00), bg: new THREE.Color(0x150202) },
    { base: new THREE.Color(0x200515), mid: new THREE.Color(0xff0080), high: new THREE.Color(0xffd700), bg: new THREE.Color(0x12020f) },
    { base: new THREE.Color(0x001020), mid: new THREE.Color(0x0066ff), high: new THREE.Color(0xffffff), bg: new THREE.Color(0x020510) }
];

let currentPaletteIndex = Math.floor(Math.random() * palettes.length);
let nextPaletteIndex = (currentPaletteIndex + 1) % palettes.length;
let transitionProgress = 0;
const transitionSpeed = 0.00015;

const currentColors = {
    base: palettes[currentPaletteIndex].base.clone(),
    mid: palettes[currentPaletteIndex].mid.clone(),
    high: palettes[currentPaletteIndex].high.clone(),
    bg: palettes[currentPaletteIndex].bg.clone()
};

// --- TEXTURE FUMÉE ---
function createSmokeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,0.9)'); 
    grd.addColorStop(0.3, 'rgba(255,255,255,0.2)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}
const smokeTexture = createSmokeTexture();

// --- COUCHES ---
function createGalaxyLayer(count, size, color, opacity, blending, spread) {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for(let i=0; i<count*3; i++) pos[i] = (Math.random() - 0.5) * spread;
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
        size: size, color: color, map: smokeTexture, 
        transparent: true, opacity: opacity, depthWrite: false, blending: blending
    });
    const points = new THREE.Points(geom, mat);
    galaxyGroup.add(points);
    return points;
}

const nebulaBase = createGalaxyLayer(50, 700, currentColors.base, 0.4, THREE.NormalBlending, 200);
const nebulaMid = createGalaxyLayer(60, 500, currentColors.mid, 0.12, THREE.AdditiveBlending, 180);
const nebulaHigh = createGalaxyLayer(40, 300, currentColors.high, 0.15, THREE.AdditiveBlending, 120);

// Étoiles
const starGeom = new THREE.BufferGeometry();
const starPos = new Float32Array(3500 * 3);
for(let i=0; i<3500*3; i++) starPos[i] = (Math.random() - 0.5) * 500;
starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ size: 0.35, color: 0xffffff, transparent: true, opacity: 0.95 });
const stars = new THREE.Points(starGeom, starMat);
galaxyGroup.add(stars);


// ==========================================
// --- FORME 3D : IMPORT MODÈLE GLB ---
// ==========================================

// 1. LUMIÈRES (OBLIGATOIRES pour voir le modèle)
const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// 2. GROUPE CONTENEUR (Pour le scroll)
const modelGroup = new THREE.Group();
scene.add(modelGroup);
modelGroup.position.set(20, 0, 10); 

// 3. CHARGEMENT DU MODÈLE (ALÉATOIRE)
const loader = new THREE.GLTFLoader();

// --- A. TA LISTE DE MODÈLES ---
// Ajoute autant de modèles que tu veux ici.
// "file" : le chemin vers ton fichier .glb
// "scale" : la taille idéale (1 = normal, 0.5 = moitié, 2 = double)
const modelList = [
    // scale: Taille | yOffset: Décalage vertical (Haut/Bas)
    { file: 'models/mario64.glb',   scale: .2, yOffset: 4 },
    { file: 'models/nyoibo.glb',   scale: .3, yOffset: 2 },
    { file: 'models/gokukidhead.glb',   scale: .2, yOffset: 7 },
    { file: 'models/star64.glb',   scale: .25, yOffset: 0 },
    { file: 'models/logon64.glb',   scale: .25, yOffset: 0 },
    { file: 'models/triforce.glb',   scale: .25, yOffset: 2 },
    { file: 'models/grandstargalaxy.glb',   scale: .4, yOffset: 2 },
    { file: 'models/stargalaxy.glb',   scale: .4, yOffset: .5 },
    { file: 'models/mastersword.glb',   scale: .4, yOffset: .5 },
    { file: 'models/poltergust.glb',   scale: .18, yOffset: .5 },
    { file: 'models/shine.glb',   scale: .3, yOffset: 0 },
    { file: 'models/coin.glb',   scale: .3, yOffset: 0 },
    { file: 'models/redcoin.glb',   scale: .3, yOffset: 0 },
    { file: 'models/bluecoin.glb',   scale: .3, yOffset: 0 },
];

// --- B. TIRAGE AU SORT ---
const randomIndex = Math.floor(Math.random() * modelList.length);
const selectedModel = modelList[randomIndex];

console.log("🎲 Modèle choisi : " + selectedModel.file);

// --- C. CHARGEMENT ---
loader.load(selectedModel.file, 
    function (gltf) {
        const model = gltf.scene;

        // 1. ÉCHELLE
        const s = selectedModel.scale;
        model.scale.set(s, s, s); 

        // 2. RECENTRAGE AUTOMATIQUE (Calcul mathématique)
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); 

        // 3. APPLICATION DE TON OFFSET MANUEL (La retouche finale)
        // Si yOffset existe dans la liste, on l'applique, sinon on ajoute 0
        const verticalShift = selectedModel.yOffset || 0; 
        model.position.y += verticalShift;

        // Optionnel : Activer les ombres sur le modèle
        model.traverse((node) => {
            if (node.isMesh) {
                // Si tu veux garder l'aspect "fil de fer" (Wireframe) sur ton modèle, décommente ça :
                node.material.wireframe = true; 
            }
        });

        modelGroup.add(model);
        window.mainMesh = model; 
    },
    undefined,
    function (error) {
        console.error('❌ Erreur sur le modèle ' + selectedModel.file + ' :', error);
    }
);


// ==========================================
// --- ANIMATION LOOP (CELLE QUI MANQUAIT) ---
// ==========================================

function animate() {
    requestAnimationFrame(animate);
    
    // 1. GESTION DES COULEURS
    transitionProgress += transitionSpeed;
    if(transitionProgress >= 1) {
        transitionProgress = 0;
        currentPaletteIndex = nextPaletteIndex;
        nextPaletteIndex = (nextPaletteIndex + 1) % palettes.length;
    }

    const p1 = palettes[currentPaletteIndex];
    const p2 = palettes[nextPaletteIndex];

    currentColors.base.lerpColors(p1.base, p2.base, transitionProgress);
    currentColors.mid.lerpColors(p1.mid, p2.mid, transitionProgress);
    currentColors.high.lerpColors(p1.high, p2.high, transitionProgress);
    currentColors.bg.lerpColors(p1.bg, p2.bg, transitionProgress);

    nebulaBase.material.color.copy(currentColors.base);
    nebulaMid.material.color.copy(currentColors.mid);
    nebulaHigh.material.color.copy(currentColors.high);
    
    // Mise à jour du fond
    scene.fog.color.copy(currentColors.bg);
    document.body.style.backgroundColor = `#${currentColors.bg.getHexString()}`;

    // 2. GESTION DU MOUVEMENT GALAXIE
    galaxyGroup.rotation.y += 0.0001; 
    nebulaBase.rotation.z += 0.00005;
    nebulaMid.rotation.y -= 0.00008;

    // 3. ANIMATION DU MODÈLE (Si chargé)
    if(window.mainMesh) {
        // Rotation sur les 3 axes
        window.mainMesh.rotation.y += 0.001; // Rotation principale (toupie)
        window.mainMesh.rotation.x += 0.002; // Légère bascule avant/arrière
        window.mainMesh.rotation.z += 0.003; // Léger roulis sur le côté
    }
    
    renderer.render(scene, camera);
}
// Lancement de l'animation
animate();


window.addEventListener('resize', () => { 
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight); 
});

// --- SCROLL ANIMATION ---
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const winH = window.innerHeight;
    
    if (scrollY < winH * 0.8) {
        gsap.to(modelGroup.position, { x: 20, y: 0, z: 10, duration: 1.5, ease: "power2.out" });
        gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 });
    }
    else if (scrollY >= winH * 0.8 && scrollY < winH * 1.8) {
        gsap.to(modelGroup.position, { x: -25, y: 0, z: 5, duration: 1.5, ease: "power2.out" });
        gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 });
    }
    else if (scrollY >= winH * 1.8 && scrollY < winH * 2.8) {
        gsap.to(modelGroup.position, { x: 25, y: -5, z: 5, duration: 1.5, ease: "power2.out" });
        gsap.to(modelGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5 });
    }
    else {
        gsap.to(modelGroup.position, { x: 0, y: 0, z: 15, duration: 1.5, ease: "back.out(1.7)" });
        gsap.to(modelGroup.scale, { x: 2, y: 2, z: 2, duration: 1.5 });
    }
});


// =========================================================
// --- 9. MUSIC PLAYER (SHUFFLE & AUTO-HIDE) ---
// =========================================================

// --- A. CONFIGURATION ---
const playlist = [
    { title: "Comet Observatory - Super Mario Galaxy", src: "musics/rosalina_observatory.mp3" },
    { title: "Title Screen - Super Mario Galaxy", src: "musics/smg-titlescreen.mp3" },
    { title: "World 7 - New Super Mario Bros", src: "musics/world7.mp3" },
    { title: "Observation Dome - Super Mario Galaxy", src: "musics/observationdome.mp3" },
    { title: " Space Junk Road - Super Mario Galaxy", src: "musics/spacejunk.mp3" },
    { title: " Dire Dire Docks - Super Mario 64", src: "musics/dirediredock.mp3" },
    { title: " Gallery - Luigi's Mansion", src: "musics/gallery.mp3" },
    { title: " Professor E.Gadd's Lab - Luigi's Mansion", src: "musics/egadds.mp3" },
    { title: " File Select - Luigi's Mansion", src: "musics/luigifile.mp3" },
    { title: " File Select - Super Mario 64", src: "musics/mariofile.mp3" },
];

let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();

// Éléments DOM
const playerExpanded = document.getElementById('music-player-expanded');
const btnMinimized = document.getElementById('music-btn-minimized');
const trackName = document.getElementById('track-name');
const playBtn = document.querySelector('.main-play');
const volumeSlider = document.getElementById('volume-slider');

// --- B. LOGIQUE ALÉATOIRE INTELLIGENTE ---
function getRandomTrackIndex(currentIndex) {
    if (playlist.length <= 1) return 0;
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * playlist.length);
    } while (newIndex === currentIndex); 
    return newIndex;
}

// --- C. LOGIQUE AUDIO ---
function loadTrack(index) {
    audio.src = playlist[index].src;
    trackName.innerText = playlist[index].title;
    if(isPlaying) audio.play();
}

function playRandomTrack() {
    currentTrackIndex = getRandomTrackIndex(currentTrackIndex);
    loadTrack(currentTrackIndex);
    if(isPlaying) audio.play(); 
    resetInactivityTimer();
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = "▶";
    } else {
        audio.play();
        playBtn.innerText = "⏸";
    }
    isPlaying = !isPlaying;
    resetInactivityTimer();
}

function nextTrack() {
    playRandomTrack();
    if(!isPlaying) { isPlaying = true; audio.play(); playBtn.innerText = "⏸"; }
}

function prevTrack() {
    playRandomTrack();
    if(!isPlaying) { isPlaying = true; audio.play(); playBtn.innerText = "⏸"; }
}

function setVolume(val) {
    audio.volume = val;
    resetInactivityTimer();
}

// AUTO-SHUFFLE
audio.addEventListener('ended', nextTrack);


// --- D. SYSTÈME AUTO-HIDE ---
let inactivityTimer;
const HIDE_DELAY = 4000; 

function showPlayer() {
    playerExpanded.classList.remove('hidden');
    btnMinimized.classList.remove('active');
    resetInactivityTimer();
}

function hidePlayer() {
    playerExpanded.classList.add('hidden');
    btnMinimized.classList.add('active');
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(hidePlayer, HIDE_DELAY);
}

function togglePlayer(forceShow) {
    if(forceShow) showPlayer();
}

// --- INITIALISATION ---
currentTrackIndex = getRandomTrackIndex(-1); 
loadTrack(currentTrackIndex);
audio.volume = volumeSlider.value;
resetInactivityTimer();

// --- E. INTERACTION SOURIS ---
playerExpanded.addEventListener('mouseenter', () => clearTimeout(inactivityTimer));
playerExpanded.addEventListener('mouseleave', () => resetInactivityTimer());