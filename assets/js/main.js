// main.js


//
// 動態載入html/js檔案
// 判斷當前 HTML 是否在 pages 子資料夾內
const basePath = window.location.pathname.includes("/pages") ? "../" : "";
const rootPath = location.hostname.includes("github.io")
  ? "https://xx4203.com" // GitHub Pages 的自訂網域
  : "";

// 動態載入其他 components 和他的 JS
document.addEventListener("DOMContentLoaded", function () {
    // 如果之後還有其他要載入，可以在這裡新增 loadComponent
    loadComponent("header", `${basePath}components/header.html`, [
        { type: "js", url: `${basePath}assets/js/header.js` }
    ]);

    loadComponent("footer", `${basePath}components/footer.html`, [
        { type: "js", url: `${basePath}assets/js/footer.js` }
        
    ] , () => {
      // 載入完成後呼叫初始化
      if (typeof initFormLogic === "function") {
        initFormLogic();
      }
  });

    loadComponent("new-year-card-form", `${basePath}components/new-year-card-form.html`, [
        { type: "js", url: `${basePath}assets/js/new-year-card-form.js` }
      ], () => {
        // 載入完成後呼叫初始化
        if (typeof initFormLogic === "function") {
          initFormLogic();
        }
    });
});

/**
 * 動態載入 HTML 和 JS
 * @param {string} containerId - 放置 Component 的 <div> ID
 * @param {string} htmlPath - HTML 檔案路徑
 * @param {Array} assets - JS 檔案列表
 */
function loadComponent(containerId, htmlPath, assets) {
    fetch(htmlPath)
      .then(response => response.text())
      .then(data => {
        document.getElementById(containerId).innerHTML = data;
        
        // 載入 JS，並在載入完成後初始化
        loadScripts(assets, () => {
          if (containerId === "new-year-card-form" && typeof initFormLogic === "function") {
            initFormLogic();  // _new-year-card-form.js 裡 export 的函式
          }
        });
      })
      .catch(error => console.error(`Error loading ${htmlPath}:`, error));
  }
  
  function loadScripts(files, callback) {
    let loaded = 0;
    const total = files.length;
  
    files.forEach(file => {
      if (file.type === "js") {
        const script = document.createElement("script");
        script.src = file.url;
        script.defer = true;
        script.onload = () => {
          loaded++;
          if (loaded === total && callback) callback();
        };
        document.body.appendChild(script);
      }
    });
}



//
// 除了 nav-link 連結，其他都新分頁開啟
const links = document.querySelectorAll('a');
links.forEach(link => {
  if (!link.classList.contains('nav-link')) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
});



//
// section 動畫
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");

  sections.forEach((section, index) => {
    section.classList.add("fade-section");
    // 延遲每個 section 的顯示時間（例如 0.2s、0.4s、0.6s）
    section.style.transitionDelay = `${index * 0.2}s`;
  });

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  sections.forEach(section => observer.observe(section));
});