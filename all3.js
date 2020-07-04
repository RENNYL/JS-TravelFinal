
// 全域變數、DOM
let Selectarea = document.querySelector('.areaSelect');
let topBtn = document.querySelector('.topArea');
let list = document.querySelector('.districtList');
let title = document.querySelector('.districTitle');
const pageId = document.getElementById('pageId');

let filterData = [];
const xhr = new XMLHttpRequest();
function getData() {
    xhr.open('get', 'https://raw.githubusercontent.com/hsiangfeng/JSHomeWork/master/JSON/datastore_search.json', true)
    xhr.send(null);
    xhr.onload = function () {

        let tempItem = JSON.parse(xhr.responseText).result.records;
        for (let i = 0; i < tempItem.length; i++) {
            if (tempItem[i].Zone === "三民區") {
                filterData.push(tempItem[i]);
            }
        }
        pagination(filterData, 1);
    }
}
getData()


// 監聽事件
Selectarea.addEventListener('change', updateListSel);//使用下拉選單後更換相對應標題及內容
topBtn.addEventListener('click', updateListBtn);//使用按鈕更換相對應標題及內容
pageId.addEventListener('click', switchPage);


// 下拉選單篩選不重複
let data = [];
function addOption(data) {
    const zoneName = new Set();
    const result = data.filter(item => !zoneName.has(item.Zone) ? zoneName.add(item.Zone) : false);
    for (let i = 0; i < result.length; i++) {
        let addOption = document.createElement('option');
        addOption.textContent = result[i].Zone;
        addOption.setAttribute = ('value', result[i].Zone)
        Selectarea.appendChild(addOption);
    }
    pagination(filterData)
}


// 分頁
function pagination(filterData, nowPage) {
    const dataTotal = filterData.length;
    const perpage = 10; // 筆數
    const pageTotal = Math.ceil(dataTotal / perpage); // 總頁數
    const currentPage = nowPage;

    const minData = (currentPage * perpage) - perpage + 1; // 當前頁數的第1筆
    const maxData = (currentPage * perpage); //當前頁數的最後一筆

    // 先建立新陣列
    const data = [];
    filterData.forEach((item, index) => {
        const num = index + 1;
        if (num >= minData && num <= maxData) {
            data.push(item);
        }

    })
    // 用物件方式來傳遞資料
    const page = {
        pageTotal,
        currentPage,
        hasPrevious: currentPage > 1,
        hasNext: currentPage < pageTotal,
    }
    displayData(data)
    pageBtn(page);

}

function displayData(data) {
    let str = '';
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

function pageBtn(page) {
    let str = '';
    const total = page.pageTotal;
    if (page.hasPage) {
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

function updateListBtn(e) {
    if (e.target.nodeName !== "LI") { return };
    for (let i = 0; i < filterData.length; i++) {
        str = e.target.textContent;
        title.textContent = str;
    }
    let emptContent = '';
    for (let i = 0; i < filterData.length; i++) {
        if (filterData[i].Zone == str) {
            const areaPic = filterData[i].Picture1;
            const areaName = filterData[i].Name;
            const zone = filterData[i].Zone;
            const opentime = filterData[i].Opentime;
            const add = filterData[i].Add;
            const phone = filterData[i].Tel;
            const ticketFree = filterData[i].Ticketinfo;
            let listContent = `<li class="card col-10 col-md-5 shadow-sm p-0 mx-2 mb-5">
            <div class="card-img-top bg-cover d-flex justify-content-between align-items-end text-white" style="background-image: url(${areaPic}); height: 155px;">
                    <h3 class="pl-3 font-weight-light">${areaName}</h3>
                    <h5 class="pr-2 font-weight-light">${zone}</h5>
            </div>
            <div class="card-body p-2">
                <ul class="card-text d-flex flex-column ">
                    <li class="pb-2"><img class="pr-2" src="image/icons_clock.png">${opentime}</li>
                    <li class="pb-2"><img class="pr-2" src="image/icons_pin.png">${add}</li>
                    <li class="pb-2 d-flex"><img class="pr-2" src="image/icons_phone.png"><span
                            class="mr-auto">${phone}</span><span><img class="pr-2"
                                src="image/icons_tag.png">${ticketFree}</span></li>
                </ul>
            </div>
        </li>`
            emptContent += listContent;
        }
    }
    list.innerHTML = emptContent
};

function updateListSel() {
    //標題
    str = Selectarea.value;
    title.textContent = str;
    //清單內容
    let emptContent = '';
    for (var i = 0; i < filterData.length; i++) {
        if (filterData[i].Zone == str) {
            const areaPic = filterData[i].Picture1;
            const areaName = filterData[i].Name;
            const zone = filterData[i].Zone;
            const opentime = filterData[i].Opentime;
            const add = filterData[i].Add;
            const phone = filterData[i].Tel;
            const ticketFree = filterData[i].Ticketinfo;
            let listContent = `<li class="card col-10 col-md-5 shadow-sm p-0 mx-2 mb-5">
            <div class="card-img-top bg-cover d-flex justify-content-between align-items-end text-white" style="background-image: url(${areaPic}); height: 155px;">
                    <h3 class="pl-3 font-weight-light">${areaName}</h3>
                    <h5 class="pr-2 font-weight-light">${zone}</h5>
            </div>
            <div class="card-body p-2">
                <ul class="card-text d-flex flex-column ">
                    <li class="pb-2"><img class="pr-2" src="image/icons_clock.png">${opentime}</li>
                    <li class="pb-2"><img class="pr-2" src="image/icons_pin.png">${add}</li>
                    <li class="pb-2 d-flex"><img class="pr-2" src="image/icons_phone.png"><span
                            class="mr-auto">${phone}</span><span><img class="pr-2"
                                src="image/icons_tag.png">${ticketFree}</span></li>
                </ul>
            </div>
        </li>`
            emptContent += listContent;
        };

    }
    list.innerHTML = emptContent
}


function switchPage(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') return;
    const page = e.target.dataset.page;
    pagination(filterData, page);
}




// gotop
let goTopBtn = document.querySelector('.gotop');
window.addEventListener("scroll", gotop);
goTopBtn.addEventListener('click', gotoTop)

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
