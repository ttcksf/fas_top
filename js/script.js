// ------------------------------------------
//  ハンバーガーメニュー
// ------------------------------------------
document.querySelector('.drawer-icon').addEventListener('click', function () {
    const body = document.querySelector('body');
    const siteMenu = document.querySelector('.drawer-content');
    const drawerIcon = document.querySelector('.drawer-icon');

    if (!body.classList.contains('is-active')) {
        scrollsPos = window.scrollY;
    }
    body.style.top = `-${window.scrollY}px`;

    // クリックした時に is-active クラスを付与/削除
    drawerIcon.classList.toggle('is-active');
    siteMenu.classList.toggle('is-active');
    body.classList.toggle('is-active');

    window.scrollTo({ top: scrollsPos, behavior: "instant" });
});

document.querySelectorAll('.drawer-menu a').forEach(link => {
    link.addEventListener('click', function () {
        document.querySelector('.drawer-icon').classList.remove('is-active');
        document.querySelector('.drawer-content')?.classList.remove('is-active'); // `.drawer-content` が存在する場合のみ処理
        document.querySelector('.drawer-menu').classList.remove('is-active');
        document.querySelector('body').classList.toggle('is-active');
    });
});

// slide
const targetWrap = document.querySelector('.reviewSwiper .swiper-wrapper');
const tar_rev = targetWrap.querySelectorAll('.swiper-slide');
tar_rev.forEach(target => {
    const clone = target.cloneNode(true); 
    targetWrap.appendChild(clone);
});

// num
document.getElementById('num_max').innerText = tar_rev.length;
let num_current = document.getElementById('num_current');
num_current.innerText = 1;
function slideC(flag){
    let num = Number(num_current.innerText);
    if(flag == 'prev'){num -= 1;}
    else{num += 1;}

    if(num == 0){num = tar_rev.length;}
    if(num > tar_rev.length){num = 1;}
    num_current.innerText = num;    
}

const reviewSwiper = new Swiper('.reviewSwiper', {
    loop: true,
    // centeredSlides: true,//スライダーの最初と最後に余白を追加せずスライドが真ん中に配置される
    slidesPerView: 1,
    spaceBetween: 15,
    breakpoints: { 
        768: { 
            slidesPerView: 1.5,
            spaceBetween: 15, // スライド間の余白（px）
        },
        1000: {
            slidesPerView: 2.2,
            spaceBetween: 30, // スライド間の余白（px）
        },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
});

//parallax
let para = document.querySelectorAll('.c-para');
let ser = document.querySelector('.introduction');

window.addEventListener('scroll', function () {
    let mount = ser.getBoundingClientRect().top;
        para.forEach(tar => {
            if(mount < 0){
                tar.style.transform = `translateY(${mount *Number(tar.dataset.dir)*Number(tar.dataset.po)}px)`;
            }else{
                tar.style.transform = `translateY(0px)`;
            }
        });

});


// fade
var def_fadeDu = 0.8;/* duration default*/
var def_fadeDe = 0;/* delay default*/ 
var def_fadeOp = 10;/* opacity default*/ 
var threshold = 0;/* 閾値 default*/
var fadeAm = 50;/* amount default*/
var targets;
var resPointer;
var observer;
var options = {
  root: null,
  rootMargin: "0px 0px -10%",
  threshold: [threshold],
};
observer = new IntersectionObserver(handleIntersect, options);
var resizeTimerInterSect;
window.addEventListener('resize', function() {/* リサイズ時 */
    clearTimeout(resizeTimerInterSect);/* タイマーキャンセル */
    resizeTimerInterSect = setTimeout(function() {startProcesses();}, 500);
});
// observer セットアップ

// window.addEventListener("load",  (event) => {startProcesses();},false,);
startProcesses();

// init_target())完了後→createObserver()開始
async function startProcesses() {
  await init_target();
  createObserver();
}
function init_target(){
  if (window.matchMedia('(max-width: 767px)').matches) {resPointer = 1;}
  else{resPointer = 0;}
  targets = document.querySelectorAll('.fade');
  for (let target of targets) {
    // リサイズ用監視停止
    observer.disconnect(target);

    target.addEventListener('transitionend', fadeTransEnd, false);
    target.style.transition = "";
    target.style.transform = "";

    // リサイズ時 再アニメーション無
    // target.classList.remove('anim_act');
    // target.style.opacity = "0";

  }
}
//交差オブザーバ作成
function createObserver() {
  for (let target of targets) {
    observer.observe(target);
  }
}
// オブザーバ発動時関数
function handleIntersect(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if(entry.intersectionRatio >= threshold && !entry.target.classList.contains("anim_act")){
        observe_fade(entry);
      }
    }
  });
}
async function observe_fade(entry){
  var fadeDu = def_fadeDu;
  var fadeDe = def_fadeDe;
  var fadeOp = def_fadeOp;
  entry.target.classList.add('anim_act');
    entry.target.style.transition = "none";/* 一時的に規定のtransitionを無効 */
    await new Promise((resolve) => {
      // targetの現在の変換行列を取得
      var transform = new DOMMatrix(getComputedStyle(entry.target).getPropertyValue('transform'));
      // x,yを指定の量加算 translateSelf:指定したベクトルを適用して行列を変更
      if(entry.target.classList.contains("fadeLR")){transform.translateSelf(-fadeAm, 0);}
      else if(entry.target.classList.contains("fadeRL")){transform.translateSelf(fadeAm, 0);}
      else if(entry.target.classList.contains("fadeTB")){transform.translateSelf(0, -fadeAm);}
      else{transform.translateSelf(0, fadeAm);}
      
      // 新しい変換行列を設定
      entry.target.style.transform = transform.toString();
      resolve();
    });
    // x,yを指定の量加算 translateSelf:指定したベクトルを適用して行列を変更        
    // 変換行列を取得
    var transform = new DOMMatrix(getComputedStyle(entry.target).getPropertyValue('transform'));
    // du
    var fadeDuArr = entry.target.getAttribute('class').match(/\bfadeDu\S*/g)
    if(fadeDuArr != null && !(fadeDuArr[0].indexOf('fadeDuRes') == -1)){
      fadeDu = parseFloat(fadeDuArr[0].replace('fadeDuRes','').split('_')[resPointer])/10
    }else if(fadeDuArr != null){
      fadeDu = parseFloat(fadeDuArr[0].replace('fadeDu',''))/10;
    }
    // de
    var fadeDeArr = entry.target.getAttribute('class').match(/\bfadeDe\S*/g)
    if(fadeDeArr != null && !(fadeDeArr[0].indexOf('fadeDeRes') == -1)){
      fadeDe = parseFloat(fadeDeArr[0].replace('fadeDeRes','').split('_')[resPointer])/10
    }else if(fadeDeArr != null){
      fadeDe = parseFloat(fadeDeArr[0].replace('fadeDe',''))/10;
    }
    // Op
    var fadeOpArr = entry.target.getAttribute('class').match(/\bfadeOp\S*/g)
    if(fadeOpArr != null && !(fadeOpArr[0].indexOf('fadeOpRes') == -1)){
      fadeOp = parseFloat(fadeOpArr[0].replace('fadeOpRes','').split('_')[resPointer])/10
    }else if(fadeOpArr != null){
      fadeOp = parseFloat(fadeOpArr[0].replace('fadeOp',''))/10;
    }else{
        fadeOp = 1;
    }

    entry.target.style.transition = "all "+fadeDu+"s "+fadeDe+"s";
    // 加算した値を戻す
    if(entry.target.classList.contains("fadeLR")){transform.translateSelf(fadeAm, 0);}
    else if(entry.target.classList.contains("fadeRL")){transform.translateSelf(-fadeAm, 0);}
    else if(entry.target.classList.contains("fadeTB")){transform.translateSelf(0, fadeAm);}
    else{transform.translateSelf(0, -fadeAm);}
    // 新しい変換行列を設定
    entry.target.style.opacity = fadeOp;
    entry.target.style.transform = transform.toString();
}
// animationが終了したら　インライン設定を削除し本来のプロパティに戻す
function fadeTransEnd(){
  if(this.classList.contains('anim_act')){
    this.style.removeProperty("transform");
    this.style.removeProperty("transition");
    this.style.removeProperty("opacity");
    this.classList.remove("fade");
    this.removeEventListener('transitionend', fadeTransEnd, false); 
  }
}
