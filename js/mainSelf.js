(() => {
  const sceneInfo = [
    {
      // scroll-section 0
      type: "sticky",
      heightNum: 5, // 어떤 기기에서 열어도 브라우저 높이의 5배로 scrollHeight가 셋팅됨
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
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
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
  }

  setLayout();
})();
