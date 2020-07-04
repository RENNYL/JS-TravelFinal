
// 全域變數、DOM
const Selectarea = document.querySelector('.areaSelect');
const topBtn = document.querySelector('.topArea');
const list = document.querySelector('.districtList');
const title = document.querySelector('.districTitle');
const goTopBtn = document.querySelector('.gotop');
const pageId = document.getElementById('pageId');
let data = [];

const xhr = new XMLHttpRequest();
xhr.open('get','https://raw.githubusercontent.com/hsiangfeng/JSHomeWork/master/JSON/datastore_search.json', true)
xhr.send(null);
xhr.onload = function(){
    let alldata = JSON.parse(xhr.responseText).result.records;
    if (title.textContent !== "全區域景點"){
        for(let i=0; i<alldata.length; i++){
            if(alldata[i].Zone === title.textContent){
                data.push(alldata)
            }
        }
}else{
    data = alldata;
}
    selectOption(); //一開始載入選單
    updateList(data); //一開始載入全部景點
    pagination(data, 1);
}


// 監聽事件
Selectarea.addEventListener('change', updateListSel);//使用下拉選單後更換相對應標題及內容
topBtn.addEventListener('click', updateListBtn);//使用按鈕更換相對應標題及內容
pageId.addEventListener('click', switchPage); //分頁事件
window.addEventListener("scroll", gotop);
goTopBtn.addEventListener('click', gotoTop)



// 下拉選單篩選不重複
let allZone = []
function selectOption(){
    for (i=0; i<data.length; i++){
        let zone = data[i].Zone;
        allZone.push(zone);
    }
    //篩選重複的區
    const zoneName = new Set();
    const zoneList = data.filter(item => !zoneName.has(item.Zone) ? zoneName.add(item.Zone) : false);

    for(let i =0; i<zoneList.length; i++){
        let addOption = document.createElement('option');
        addOption.textContent = zoneList[i].Zone;
        addOption.setAttribute = ('value', zoneList[i].Zone)
        Selectarea.appendChild(addOption);
    }
}


//顯示景點列表
function updateList(data){
    let str = "";
    data.forEach((item) => {
        str +=
            `
        <li class="card col-10 col-md-5 shadow-sm p-0 mx-2 mb-5">
            <div class="card-img-top bg-cover d-flex justify-content-between align-items-end text-white" style="background-image: url(${item.Picture1}); height: 155px;">
                <h3 class="pl-3 font-weight-light">${item.Name}</h3>
                    <h5 class="pr-2 font-weight-light">${item.Zone}</h5>
            </div>
            <div class="card-body p-2">
                <ul class="card-text d-flex flex-column ">
                    <li class="pb-2"><img class="pr-2" src="image/icons_clock.png">${item.Opentime}</li>
                        <li class="pb-2"><img class="pr-2" src="image/icons_pin.png">${item.Add}</li>
                            <li class="pb-2 d-flex"><img class="pr-2" src="image/icons_phone.png"><span
                                class="mr-auto">${item.Tel}</span><span><img class="pr-2"
                                    src="image/icons_tag.png">${item.Ticketinfo}</span></li>
                </ul>
            </div>
        </li>
        `
    });
    list.innerHTML = str;
    
}


function updateListSel(e){
    let selectdata = [];
    str = Selectarea.value;
    title.textContent = str;
    for (let i = 0; i < data.length; i++) {
        if (e.target.value === data[i].Zone) {
            selectdata.push(data[i]);
        } else if (e.target.value === '全區域景點') {
            selectdata = data;
        }
    }
    updateList(selectdata);
    pagination(selectdata, 1);
};


function updateListBtn(e){
    let target = e.target.nodeName;
    if (target !== 'LI'){
        return 
    } else {
        let selectdata = [];
        str = e.target.textContent;//標題替換
        title.textContent = str;//標題替換
        for (let i = 0; i < data.length; i++) {
            if (e.target.textContent === data[i].Zone) {
                selectdata.push(data[i]);
            }
        }
        updateList(selectdata);
        pagination(selectdata, 1);
        
    }
}


// 分頁
function pagination(data, nowPage) {
    const dataTotal = data.length;
    const perpage = 10; // 筆數
    const pageTotal = Math.ceil(dataTotal / perpage); // 總頁數
    const currentPage = nowPage;
    const minData = (currentPage * perpage) - perpage + 1; // 當前頁數的第1筆
    const maxData = (currentPage * perpage); //當前頁數的最後一筆

    // 建立新陣列
    const Newdata = [];
    data.forEach((item, index) => {
        const num = index + 1;
        if (num >= minData && num <= maxData) {
            Newdata.push(item);
        }
    })
    // 用物件方式來傳遞資料
    const page = {
        pageTotal,
        currentPage,
        hasPrevious: currentPage > 1,
        hasNext: currentPage < pageTotal,
    }
    updateList(Newdata)
    pageBtn(page);
    switchPage()
}

function pageBtn(page) {
    let str = '';
    const total = page.pageTotal;
    if (page.hasPrevious) {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) - 1}">Previous</a></li>`;
    } else {
        str += `<li class="page-item disabled"><span class="page-link">Previous</span></li>`;
    }
    for (let i = 1; i <= total; i++) {
        if (Number(page.currentPage) === i) {
            str += `<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        } else {
            str += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
    };
    if (page.hasNext) {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) + 1}">Next</a></li>`;
    } else {
        str += `<li class="page-item disabled"><span class="page-link">Next</span></li>`;
    }
    pageId.innerHTML = str;
}

function switchPage(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') return;
    const page = e.target.dataset.page;
    let tempItem =[];
    if(title.textContent === "全區域景點"){
        pagination(data, page);
    }else{
        for(let i=0; i<data.length;i++){
            if(data[i].Zone === title.textContent){
                tempItem.push(data[i])
            }
        }
    }
    pagination(tempItem, page);
}

// gotop
function gotop(e) {
    const scrollAt = window.scrollY;
    if (scrollAt >= 670) {
        goTopBtn.style.width = "40px";
    } else {
        goTopBtn.style.width = "0";
    }
}
gotop()

function gotoTop() {
    if (window.scrollY != 0) {
        setTimeout(function () {
            window.scrollTo(0, window.scrollY - 40);
            gotoTop();
        }, 15);
    }
}
