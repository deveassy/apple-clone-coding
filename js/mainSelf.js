(() => {
  let yOffset = 0; // window.pageOffset 대신 사용 할 변수, 블럭 내부의 어디서든 접근 가능
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션 스크롤 높이값의 합
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
      },
      values: {
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], // 스크롤값에 따른 중간값을 계산해서 css 스타일링에 적용(메세지가 나타나고, 위치가 바뀌는 등)
        messageA_translateY_in: [20, 0, {start: 0.1, end: 0.2}],

        messageA_opacity_out: [0, 1, { start: 0.25, end: 0.3 }],
        messageA_translateY_out: [0, -20, {start: 0.25, end: 0.3}],

        messageB_opacity_in: [1, 0, { start: 0.3, end: 0.4 }],
      },
    },
    {
      // scroll-section 1
      type: "normal",
      heightNum: 5,
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
      },
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

  function setLayout() {
    // 각 스크롤섹션의 높이 셋팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if ( sceneInfo[i].type === 'sticky') {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
        sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
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
  }

  // 현재 섹션에서 스크롤이 얼마나 움직였는지의 비율(0~1)을 계산해서 css에 적용하기 위한 함수
  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬(스크롤 섹션)에서 스크롤 된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&currentYOffset <= partScrollEnd
      ) {
        rv = ((currentYOffset - partScrollStart) / partScrollHeight) *(values[1] - values[0]) + values[0];
      } else if (currentYOffset < partScrollEnd) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight; // 전체 스크롤값에서 이전 섹션들의 스크롤값 총합을 뺀 값
    const scrollHeight = sceneInfo[currentScene].scrollHieght;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        // messageA가 0에서 등장하기 때문에 'in'으로 구분하기(나가는건 out)
        if ( scrollRatio <= 0.22 ) {
          // in일 때
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in,currentYOffset);
          objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in,currentYOffset)}%)`;
        } else {
          // out일 때
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out,currentYOffset);
          objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out,currentYOffset)}%)`;
        }

        break;

      case 1:
        break;

      case 2:
        break;

      case 3:
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0; // 초기화를 해주지 않으면 값이 기하급수적으로 늘어나기만 함

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
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
  window.addEventListener("load", setLayout); // 이미지와 텍스트가 같이 로드되어야 하기 때문, 페이지가 다 로드되기 이전에 나오는 로드표시까지 함께 작동하게 하기 위함
  window.addEventListener("resize", setLayout);
})();
