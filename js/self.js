(() => {

  let yOffset = 0; // 현재 스크롤 위치 - window.pageOffset 대신 사용 할 변수, 블럭 내부의 어디서든 접근 가능
  let prevScrollHeight = 0; // yOffset보다 이전에 위치한 스크롤 섹션 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화 된(내가 보고 있는) 씬의 번호(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true로 바뀜

  const sceneInfo = [
    {
      // scroll-section 0
      type: "sticky",
      heightNum: 5, // 어떤 기기에서 열어도 브라우저 높이의 5배로 scrollHeight가 셋팅됨
      scrollHeight: 0,
      objs: {
            container: document.querySelector("#scroll-section-0"),
            messageA: document.querySelector("#scroll-section-0 .main-message.a"),
            messageB: document.querySelector("#scroll-section-0 .main-message.b"),
            messageC: document.querySelector("#scroll-section-0 .main-message.c"),
            messageD: document.querySelector("#scroll-section-0 .main-message.d"),
            canvas: document.querySelector('#video-canvas-0'),
            context: document.querySelector("#video-canvas-0").getContext('2d'),
            videoImages: [] 
      },
      values: {
            videoImageCount: 300,
            imageSequence: [0, 299],
            canvas_opacity: [1, 0, {start: 0.9, end: 1}],
            messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
            messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
            messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
            messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
            messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
            messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
            messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
            messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
            messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
            messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
            messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
            messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
            messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
            messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
            messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
            messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
      },
    },
    {
      // scroll-section 1
      type: "normal",
      // heightNum: 5,
      scrollHeight: 0,
      objs: {
            container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // scroll-section 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
            container: document.querySelector("#scroll-section-2"),
            messageA: document.querySelector("#scroll-section-2 .a"),
            messageB: document.querySelector("#scroll-section-2 .b"),
            messageC: document.querySelector("#scroll-section-2 .c"),
            pinB: document.querySelector("#scroll-section-2 .b .pin"),
            pinC: document.querySelector("#scroll-section-2 .c .pin"),
            canvas: document.querySelector('#video-canvas-2'),
            context: document.querySelector("#video-canvas-2").getContext('2d'),
            videoImages: []
      },
      values: {
            videoImageCount: 960,
            imageSequence: [0, 959],
            canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
            canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
            messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
            messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
            messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
            messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
            messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
            messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
            messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
            messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
            messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
            messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
            messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
            messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
            pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
            pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
      }
    },
    {
      // scroll-section 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

  // video interaction을 위한 이미지를 캔버스에 붙히는 함수
  function setCanvasImages() {
          let imgElem0;
          for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
              imgElem0 = new Image();
              imgElem0.src = `../video/001/IMG_${6726 + i}.JPG`;
              sceneInfo[0].objs.videoImages.push(imgElem0); // 첫번째 씬에서 사용하는 이미지 이기 때문에 [0]
          }

          let imgElem2;
          for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
              imgElem2 = new Image();
              imgElem2.src = `../video/002/IMG_${7027 + i}.JPG`;
              sceneInfo[2].objs.videoImages.push(imgElem2);
          }
  }
  setCanvasImages();

  // 각 스크롤섹션의 높이 셋팅
  function setLayout() {
    for (let i = 0; i < sceneInfo.length; i++) {
      if ( sceneInfo[i].type === 'sticky') {
          sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if ( sceneInfo[i].type === 'normal' ) {
          sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
        }
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);

    const heightRatio = window.innerHeight /1080; // canvas크기와 window의 크기에 대한 비율로 맞춰주면 됨
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%,-50%, 0) scale(${heightRatio})`; // scale에 변화를 주었기 때문에 top:0으로 맞춰줘도 딱 맞게 붙지 않음
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%,-50%, 0) scale(${heightRatio})`; 
  }

  // 현재 섹션에서 스크롤이 얼마나 움직였는지의 비율(0~1)을 계산해서 css에 적용하기 위한 함수
  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬(스크롤 섹션)에서만 스크롤 된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    // start ~ end 사이에 애니메이션 실행 (values의 길이가 3일 때, 세번째 원소가 존재할 때 작동하도록 함)
    if (values.length === 3) {
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

        if ( (currentYOffset >= partScrollStart) && (currentYOffset <= partScrollEnd)) {
            rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
      } else if (currentYOffset < partScrollStart) {
            rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
            rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv; // return 값이 존재해야 계산된 값을 사용할 수 있음
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight; // 전체 스크롤값에서 이전 섹션들의 스크롤값 총합을 뺀 값
    const scrollHeight = sceneInfo[currentScene].scrollHieght;
    const scrollRatio = currentYOffset / scrollHeight; // currentYOffest을 사용하는 이유는, 첫번째 섹션이 아닌 이상 yOffset에서 이전 섹션들의 스크롤합은 빼주어야 하기 때문
    
    switch (currentScene) {
      
      case 0:
        let sequence0 = Math.round(calcValues(values.imageSequence, currentYOffset));
        objs.context.drawImage(objs.videoImages[sequence0], 0, 0);
        objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
        // messageA가 0에서 등장하기 때문에 'in'으로 구분하기(나가는건 out)
        // opacity의 start와 end시점의 중간지점의 비율을 잡아서 그 지점보다 작을땐 in에 해당되는 효과를, 클땐 out에 해당되는 효과를 나타나게 함
        if ( scrollRatio <= 0.22 ) {
          // in일 때
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
        } else {
          // out일 때
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.42) {
          // in
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
        } else {
            // out
            objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
            objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
            // in
            objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
            objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
        } else {
            // out
            objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
            objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
            // in
            objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
            objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
        } else {
            // out
            objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
            objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
        }

        break;

      case 2:
        let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
        objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

        if ( scrollRatio <= 0.5 ) {
          // in
            objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
        } else {
          // out
            objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
        }
        
        if ( scrollRatio <= 0.32 ) {
          // in일 때
            objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
            objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
        } else {
          // out일 때
            objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
            objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`;
        }

        if (scrollRatio <= 0.67) {
          // in
            objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
            objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
            objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
        } else {
            // out
            objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
            objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
            objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
        }

        if (scrollRatio <= 0.93) {
            // in
            objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
            objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
            objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
        } else {
            // out
            objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
            objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
            objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
        }
        
        break;

      case 3:
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0; // 초기화를 해주지 않으면 값이 기하급수적으로 늘어나기만 함

    console.log('sceneInfo', currentScene);
    
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      // if (currentScene === sceneInfo.length - 1) {
			// 	document.body.classList.add('scroll-effect-end');
			// }
      // if (currentScene < sceneInfo.length - 1) {
			// 	currentScene++;
			// }
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return; // 가끔 브라우저별로 바운스 효과가 일어나게 되면 currentScened이 -1이 되는 경우가 있기 때문 (모바일)
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return; // enterNewScene이 true라면 멈추게 해서 playAnimation이 한턴 걸러지게 되도록 함 (1에서 다시 스크롤을 위로 올렸을 때 음수가 나오는 것을 막아줌)

    playAnimation();
  }

  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
  window.addEventListener("load", () => {
    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
  }); // 이미지와 텍스트가 같이 로드되어야 하기 때문, 페이지가 다 로드되기 이전에 나오는 로드표시까지 함께 작동하게 하기 위함
  window.addEventListener("resize", setLayout);
})();
