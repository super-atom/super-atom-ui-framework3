$(() => {
  const title = 'Publishing List';
  const tableData = [
    /*
        {
          depth1: '',
          data: [
            {
              depth2: '',
              depth3: '',
              depth4: '',
              depth5: '',
              depth6: '',
              id: '',
              path: '',
              status: '',
              create: '',
              update: '',
              worker: '이름', log: [
                //{ date: '2025.01.01', text: '', },
              ],
            },
          ],
        },
        */
    {
      depth1: '가이드',
      data: [
        {
          depth2: 'Log',
          depth3: '',
          depth4: '',
          depth5: '',
          depth6: '',
          id: '',
          path: '/html/guide/log.html',
          status: 'except',
          create: '2025.00.00',
          worker: '익명',
          log: [],
        },
        {
          depth2: 'Design System',
          depth3: 'Color',
          depth4: '',
          depth5: '',
          depth6: '',
          id: '',
          path: '/html/guide/color.html',
          status: 'except',
          create: '2025.00.00',
          worker: '익명',
          log: [],
        },
        {
          depth2: '',
          depth3: 'Typography',
          depth4: '',
          depth5: '',
          depth6: '',
          id: '',
          path: '/html/guide/typography.html',
          status: 'except',
          create: '2025.00.00',
          worker: '익명',
          log: [],
        },
        {
          depth2: 'Components',
          depth3: 'Button',
          depth4: '',
          depth5: '',
          depth6: '',
          id: '',
          path: '/html/guide/button.html',
          status: 'except',
          create: '2025.00.00',
          worker: '익명',
          log: [],
        },
        {
          depth2: '',
          depth3: 'Form',
          depth4: '',
          depth5: '',
          depth6: '',
          id: '',
          path: '/html/guide/form.html',
          status: 'except',
          create: '2025.00.00',
          worker: '익명',
          log: [],
        },
        {
          depth2: '',
          depth3: 'Checkbox',
          depth4: '',
          depth5: '',
          depth6: '',
          id: '',
          path: '/html/guide/checkbox.html',
          status: 'except',
          create: '2025.00.00',
          worker: '익명',
          log: [],
        },
        {
          depth2: '',
          depth3: 'Select',
          depth4: '',
          depth5: '',
          depth6: '',
          id: '',
          path: '/html/guide/select.html',
          status: 'except',
          create: '2025.00.00',
          worker: '익명',
          log: [],
        },
      ],
    },
    {
      depth1: '샘플',
      data: [
        {
          depth2: '샘플',
          depth3: '',
          depth4: '',
          depth5: '',
          depth6: '',
          id: '',
          path: '/html/sample.html',
          status: 'end',
          create: '2025.00.00',
          worker: '익명',
          log: [
            {
              date: '2025.00.00',
              text: '샘플 페이지 추가',
            },
          ],
        },
      ],
    },
  ];

  let html = '';
  let navHTML = '';

  // 상태값 및 클래스 매핑을 하나의 객체로 통합
  const statusInfo = {
    ready: { label: '진행대기', class: 'index-status--ready' },
    progress: { label: '진행중', class: 'index-status--progress' },
    end: { label: '완료', class: 'index-status--end' },
    confirm: { label: '검수완료', class: 'index-status--confirm' },
    modify: { label: '수정완료', class: 'index-status--modify' },
    hold: { label: '보류', class: 'index-status--hold' },
    except: { label: '제외', class: 'index-status--except' },
    '': { label: '미정', class: 'index-status--pending' },
  };

  // 모든 상태값 추출
  const allStatus = new Set();
  tableData.forEach((section) => {
    section.data.forEach((row) => {
      allStatus.add(row.status || '');
    });
  });

  // select 옵션 생성
  const statusOptions = Array.from(allStatus)
    .filter((status) => status in statusInfo)
    .map(
      (status) =>
        `<option value="${status === '' ? 'pending' : status}">${statusInfo[status].label}</option>`,
    )
    .join('');
  // select에 옵션 적용
  $(() => {
    $('#statusSelect').html(
      `<option value="all">전체</option>${statusOptions}`,
    );
  });

  // 날짜 수집 및 정렬
  const dates = (() => {
    const array = [];
    const add = (date) => {
      if (typeof date === 'string' && date.length && !array.includes(date)) {
        array.push(date);
      }
    };
    tableData.forEach((section) => {
      section.data.forEach((row) => {
        add(row.create);
        row.log.forEach((log) => add(log.date));
      });
    });
    array.sort();
    return array;
  })();
  const latestDate = dates[dates.length - 1];

  // 상태별 카운트 및 퍼센트 계산 후 #statusList에 표시
  function renderStatusList(filteredStatus = 'all') {
    const allRows = tableData.flatMap((section) => section.data);
    let filteredRows;
    if (filteredStatus === 'all') {
      filteredRows = allRows;
    } else if (filteredStatus === 'pending') {
      filteredRows = allRows.filter((row) => (row.status || '') === '');
    } else {
      filteredRows = allRows.filter((row) => row.status === filteredStatus);
    }

    // except 상태를 제외한 전체 건수 계산
    const totalExcludingExcept = filteredRows.filter(
      (row) => row.status !== 'except',
    ).length;
    const total = filteredRows.length || allRows.length;

    // 상태별 카운트
    const statusCounts = {};
    Object.keys(statusInfo).forEach((key) => {
      statusCounts[key] = filteredRows.filter(
        (row) => (row.status || '') === key,
      ).length;
    });

    // '보류'와 '제외' 상태를 제외한 진행 대상 건수 계산
    const progressTargetCount = Object.keys(statusInfo).reduce((sum, key) => {
      if (key !== 'hold' && key !== 'except') {
        // '보류'와 '제외' 제외
        return sum + statusCounts[key];
      }
      return sum;
    }, 0);

    // 완료된 작업 건수 계산 (end, confirm, modify 상태)
    const completedCount = ['end', 'confirm', 'modify'].reduce((sum, key) => {
      return sum + statusCounts[key];
    }, 0);

    // 진행률 계산 (보류, 제외 제외한 상태들 중 완료된 비율)
    const progressPercentage =
      progressTargetCount > 0
        ? Math.round((completedCount / progressTargetCount) * 100)
        : 0;

    // 상태별 퍼센트 (except 제외한 전체 기준)
    const statusPercentages = {};
    Object.keys(statusInfo).forEach((key) => {
      statusPercentages[key] = totalExcludingExcept
        ? Math.round((statusCounts[key] / totalExcludingExcept) * 100)
        : 0;
    });

    // 리스트 HTML 생성 (각 상태별 클래스 매핑)
    let html = `
      <li class="status-list">
        전체 : <span class="quantity">${totalExcludingExcept}</span>건
        <span class="percentage">(${progressPercentage}%)</span>
      </li>
    `;
    Object.entries(statusInfo).forEach(([key, info]) => {
      const className = info.class
        ? `status-list ${info.class}`
        : 'status-list';
      html += `
        <li class="${className}">
          ${info.label} : <span class="quantity">${statusCounts[key]}</span>건
          <span class="percentage">(${statusPercentages[key]}%)</span>
        </li>
      `;
    });

    $('#statusList').html(html);
  }

  // 렌더 함수(상태별 필터)
  function renderTable(filterStatus = 'all') {
    html = '';
    navHTML = '';
    let totalCount = 0;

    tableData.forEach((section, i) => {
      const sectionData = section.data;
      let tableHTML = '';

      sectionData.forEach((row, j) => {
        let match = true;
        if (filterStatus === 'pending') {
          match = (row.status || '') === '';
        } else if (filterStatus !== 'all') {
          match = row.status === filterStatus;
        }
        if (!match) return;

        const getVal = (key) =>
          row[key] ? row[key].replace(/\n/g, '<br>') : '';

        const id = getVal('id');
        const depth2 = getVal('depth2');
        const depth3 = getVal('depth3');
        const depth4 = getVal('depth4');
        const depth5 = getVal('depth5');
        const depth6 = getVal('depth6');
        const path = (() => {
          const val = row.path;
          if (!val) return '';
          const href = val.match(/^\.\//) ? val : `.${val}`;
          return `<a href="${href}" target="_blank">${val}</a>`;
        })();
        const status = (() => {
          const val = row.status;
          const info = statusInfo[val] || statusInfo[''];
          return `<span class="index-status ${info.class}">${info.label}</span>`;
        })();
        const create = row.create;
        const worker = row.worker;
        let update = '';
        const log = (() => {
          const val = row.log;
          let html = '<ul class="index-log">';
          val.forEach((logItem, l) => {
            const date = logItem.date;
            html += `<li class="index-log__item${date === latestDate ? ' is-emphasis' : ''}"><div class="index-log__item__date">[${date}]</div>${logItem.text.replace(/\n/g, '<br>')}</li>`;
            if (val.length - 1 === l) update = date;
          });
          html += '</ul>';
          return html;
        })();

        tableHTML += `
          <tr>
            <td>${j + 1}</td>
            <td>${depth2}</td>
            <td>${depth3}</td>
            <td>${depth4}</td>
            <td>${depth5}</td>
            <td>${depth6}</td>
            <td${id.trim() ? ` data-screen-id="${id.trim()}"` : ''}>${id}</td>
            <td class="data-path">${path}</td>
            <td class="data-status">${status}</td>
            <td class="data-create"><span class="${create === latestDate ? 'is-emphasis' : ''}">${create}</span></td>
            <td class="data-worker">${worker}</td>
            <td class="data-update"><span class="${update === latestDate ? 'is-emphasis' : ''}">${update}</span></td>
            <td class="data-log">${log}</td>
          </tr>
        `;
        totalCount++;
      });

      if (tableHTML) {
        navHTML += `<a href="#section${i}">${section.depth1}</a>`;
        html += `
          <div class="index-section" id="section${i}">
            <h2 class="index-section__title">${section.depth1}</h2>
            <div class="index-table">
              <table>
                <colgroup>
                  <col width="60px" />
                  ${'<col width="160px" />'.repeat(6)}
                  <col width="" />
                  ${'<col width="100px" />'.repeat(2)}
                  <col width="80px" />
                  <col width="100px" />
                  <col width="300px" />
                </colgroup>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Depth2</th>
                    <th>Depth3</th>
                    <th>Depth4</th>
                    <th>Depth5</th>
                    <th>Depth6</th>
                    <th>ID</th>
                    <th>Path</th>
                    <th>Status</th>
                    <th>Create</th>
                    <th>Worker</th>
                    <th>Update</th>
                    <th>Log</th>
                  </tr>
                </thead>
                <tbody>${tableHTML}</tbody>
              </table>
            </div>
          </div>
        `;
      }
    });

    $('title, .index-title').text(title);
    $('#nav').html(navHTML);
    $('#indexTable').html(html);
    $('.quantity').first().text(totalCount);

    // 상태별 리스트 렌더링
    renderStatusList(filterStatus);
  }

  // 최초 전체 렌더
  $(document).ready(() => {
    renderTable();

    // select 변경 이벤트
    $('#statusSelect').on('change', function () {
      const val = $(this).val();
      // 전체: all, 미정: pending, 나머지는 그대로
      renderTable(val);
    });
  });

  // 이하 기존 코드(스크롤, 클릭 등) 그대로 유지
  const $nav = $('.index-bottom');
  const $doc = $(document);
  const $win = $(window);

  const paddingBottom = () => {
    $('.index-fake-botttom').css('height', $nav.outerHeight());
  };

  let clickedTimer = null;

  $doc.on('click', '#nav a', function () {
    const $this = $(this);
    const href = $this.attr('href');
    const $target = $(href);
    const $sections = $('.index-section');

    $sections.removeClass('index-section--clicked');
    clearTimeout(clickedTimer);

    clickedTimer = setTimeout(() => {
      $target.addClass('index-section--clicked');
    }, 100);
  });

  $win
    .on('scroll', () => {
      const scrollLeft = $win.scrollLeft();
      $nav.css('margin-left', -scrollLeft);
    })
    .on('resize', paddingBottom)
    .on('load', paddingBottom);
});
