document.addEventListener('DOMContentLoaded', () => {
  // === 1. 導覽列滾動與收縮效果 ===
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // === 2. 行動端選單切換 ===
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // 點擊選單項目後自動關閉選單 (針對錨點連結)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // === 3. 數字動態計數器 (Stats Counter) ===
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length > 0) {
    const runCounter = () => {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        let count = 0;
        const speed = target / 50; // 控制動畫時間

        const updateCount = () => {
          if (count < target) {
            count += Math.ceil(speed);
            if (count > target) count = target;
            counter.innerText = count.toLocaleString();
            setTimeout(updateCount, 25);
          } else {
            counter.innerText = target.toLocaleString();
          }
        };
        updateCount();
      });
    };

    // 使用 Intersection Observer 當元素捲動到畫面時才啟動計數器
    const observerOptions = {
      root: null,
      threshold: 0.2
    };

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounter();
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      observer.observe(statsSection);
    } else {
      // 若找不到 stats-grid 則直接執行
      runCounter();
    }
  }

  // === 4. 十大角頭地區篩選功能 (於 organization.html 中使用) ===
  const filterButtons = document.querySelectorAll('.filter-btn');
  const jiaotouCards = document.querySelectorAll('.jiaotou-card');

  if (filterButtons.length > 0 && jiaotouCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // 切換 Active 狀態
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        jiaotouCards.forEach(card => {
          if (filterValue === 'all') {
            card.style.display = 'block';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            const county = card.getAttribute('data-county');
            if (county === filterValue) {
              card.style.display = 'block';
              card.style.opacity = '0';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              }, 50);
            } else {
              card.style.transform = 'scale(0.95)';
              card.style.opacity = '0';
              setTimeout(() => {
                card.style.display = 'none';
              }, 300);
            }
          }
        });
      });
    });
  }

  // === 5. 數據儀表板切換邏輯 (於 digital.html 中使用) ===
  const dbTabButtons = document.querySelectorAll('.db-tab-btn');
  const chartTitle = document.getElementById('chart-title');
  const barChart = document.getElementById('bar-chart');
  const segmentContainer = document.getElementById('segment-container');

  // 不同分頁的數據庫
  const dashboardData = {
    heat: {
      title: '十大角頭信徒年度參與熱度 (人次)',
      bars: [
        { label: '台中角', value: '4,500', height: '90%' },
        { label: '彰化東角', value: '3,800', height: '76%' },
        { label: '彰化南角', value: '3,200', height: '64%' },
        { label: '草屯角', value: '2,900', height: '58%' },
        { label: '員林北角', value: '2,700', height: '54%' },
        { label: '龍眼林角', value: '1,800', height: '36%' }
      ],
      segments: [
        { title: '核心活躍角頭', desc: '台中角、彰化東角、彰化南角', val: '68%', type: 'high' },
        { title: '穩定參與角頭', desc: '草屯角、草屯東角、員林北角、員林南角', val: '22%', type: 'med' },
        { title: '潛力增長角頭', desc: '龍眼林角、南投第一區角、南投第三區角', val: '10%', type: 'new' }
      ]
    },
    members: {
      title: '信徒分眾 RFIM 畫像與黏著度指標',
      bars: [
        { label: '資深核心信徒', value: '1,200', height: '85%' },
        { label: '中生代主力', value: '980', height: '70%' },
        { label: '年度參與者', value: '1,450', height: '95%' },
        { label: '新世代參與', value: '620', height: '44%' },
        { label: '偶爾參與者', value: '450', height: '32%' },
        { label: '線上訂閱信眾', value: '880', height: '62%' }
      ],
      segments: [
        { title: '高頻參與信眾 (每月參拜/活動必到)', desc: '忠誠度極高，主要為理監事及資深會腳', val: '45%', type: 'high' },
        { title: '中頻參與信眾 (年度進香與大慶典)', desc: '二媽年進香的主力部隊，認同感強', val: '38%', type: 'med' },
        { title: '低頻與新加入 (社群觸及與新手)', desc: '近年透過智慧導購與線上香火袋加入者', val: '17%', type: 'new' }
      ]
    },
    materials: {
      title: '笨港進香物資與文化週邊需求預測',
      bars: [
        { label: '特製香火袋', value: '5,000', height: '100%' },
        { label: '隨香紀念帽', value: '3,500', height: '70%' },
        { label: '老二媽令符', value: '4,000', height: '80%' },
        { label: '聯名平安米', value: '2,800', height: '56%' },
        { label: '進香隨行杯', value: '1,500', height: '30%' },
        { label: '隨香護腕', value: '1,200', height: '24%' }
      ],
      segments: [
        { title: '主力祈福隨身物', desc: '特製香火袋、老二媽令符、平安符', val: '58%', type: 'high' },
        { title: '進香實用配件', desc: '紀念帽、隨行杯、聯名毛巾', val: '32%', type: 'med' },
        { title: '節慶限定伴手禮', desc: '平安米、聯名糕餅禮盒', val: '10%', type: 'new' }
      ]
    }
  };

  if (dbTabButtons.length > 0 && chartTitle && barChart && segmentContainer) {
    // 渲染儀表板的函式
    const renderDashboard = (tabKey) => {
      const data = dashboardData[tabKey];
      if (!data) return;

      // 1. 更新標題
      chartTitle.innerText = data.title;

      // 2. 渲染柱狀圖
      barChart.innerHTML = '';
      data.bars.forEach(bar => {
        const barWrapper = document.createElement('div');
        barWrapper.className = 'bar-wrapper';

        const barPill = document.createElement('div');
        barPill.className = 'bar-pill';
        barPill.style.height = '0%'; // 初始為 0 供動畫伸展
        barPill.setAttribute('data-value', bar.value);

        const barLabel = document.createElement('div');
        barLabel.className = 'bar-label';
        barLabel.innerText = bar.label;

        barWrapper.appendChild(barPill);
        barWrapper.appendChild(barLabel);
        barChart.appendChild(barWrapper);

        // 觸發高度動畫
        setTimeout(() => {
          barPill.style.height = bar.height;
        }, 100);
      });

      // 3. 渲染右側分眾清單
      segmentContainer.innerHTML = '';
      data.segments.forEach(seg => {
        const segItem = document.createElement('div');
        segItem.className = `segment-item seg-${seg.type}`;

        const segInfo = document.createElement('div');
        segInfo.className = 'seg-info';
        segInfo.innerHTML = `
          <h4>${seg.title}</h4>
          <p>${seg.desc}</p>
        `;

        const segVal = document.createElement('div');
        segVal.className = 'seg-val';
        segVal.innerHTML = `${seg.val}<span>佔比</span>`;

        segItem.appendChild(segInfo);
        segItem.appendChild(segVal);
        segmentContainer.appendChild(segItem);
      });
    };

    // 綁定按鈕點擊事件
    dbTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        dbTabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tabKey = btn.getAttribute('data-tab');
        renderDashboard(tabKey);
      });
    });

    // 預設渲染第一個 (熱度分析)
    renderDashboard('heat');
  }

  // === 6. 微光漂浮顆粒背景效果 ===
  const createAmbientParticles = () => {
    const body = document.body;
    // 限制在非移動端建立以維持效能
    if (window.innerWidth < 768) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.5,
        d: Math.random() * particleCount,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(223, 172, 68, 0.4)'; // 金黃色微粒

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // 漂浮位移
        p.y -= p.speed;
        p.x += Math.sin(p.y / 30) * 0.2;

        // 邊界檢查
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
      });

      requestAnimationFrame(draw);
    };

    draw();
  };

  createAmbientParticles();
});
