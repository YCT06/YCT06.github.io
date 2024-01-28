const youBikeDataUrlSet = {
    臺北市:
        "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json",
    新北市:
        "https://data.ntpc.gov.tw/api/datasets/010E5B15-3823-4B20-B401-B1CF000550C5/json?page=0&size=1000",
    桃園市:
        "https://data.tycg.gov.tw/api/v1/rest/datastore/a1b4714b-3b75-4ff8-a8f2-cc377e4eaa0f?format=json",
    高雄市:
        "https://api.kcg.gov.tw/api/service/Get/b4dd9c40-9027-4125-8666-06bef1756092"
};
const citySelect = document.getElementById("city_select");
const areaSelect = document.getElementById("area_select");
const myTable = document.getElementById("my_table");


let cityArr = [];
let currentCityYouBikeDataArr = [];
let markers = L.markerClusterGroup();
let taiwanAreaData = [];

window.addEventListener("load", () => {
    //初始化選單:縣市選項
    fetchTaiwanAreaData()
        .then((data) => {
            taiwanAreaData = data;
            return fetchCityData();
        })
        .then((data) => {
            cityArr = data;
            cityArr.forEach((item) => {
                citySelect.innerHTML += `<option value="${item.City}">${item.City}</option>`;
            });
        });
    //監聽事件:對應選單變化
    citySelect.addEventListener("change", handleCityChange);
    areaSelect.addEventListener("change", handleAreaChange);
});

function handleCityChange(e) {
    //區域的選單
    initAreaSelect(e.target.value);
    const dataSourceUrl = youBikeDataUrlSet[e.target.value];
    //區域的站點資料
    fetchYouBikeData(dataSourceUrl)
        .then((data) => {
            currentCityYouBikeDataArr = data;
            //縣市的json格式不同, 要另外撈資料
            if(e.target.value === "桃園市"){
                currentCityYouBikeDataArr = data.result.records
            }
            if(e.target.value === "高雄市"){
                currentCityYouBikeDataArr = data.data.retVal
            }
            renderingTableData(currentCityYouBikeDataArr);
        })
        .catch(() => {
            alert("無法取得YouBike資料");
            currentCityYouBikeDataArr = [];
            renderingTableData(currentCityYouBikeDataArr);
        });
}

function handleAreaChange(e) {
    //從縣市的json去篩區域與選中相同的做畫面渲染
    const areaData = currentCityYouBikeDataArr.filter((item) => item.sarea === e.target.value);
    renderingTableData(areaData);
    //畫面移動至該區
    setMapView(e.target.value);
}

function setMapView(district) {
    //畫面移動到第一個符合條件的區
    const theArea = taiwanAreaData.find((item) => item.District === district);
    map.flyTo([theArea.Lat, theArea.Lng], 14);
}

function renderingTableData(youBikeData) {
    //標題列渲染, 並清空內容
    const tHead = myTable.querySelector("thead");
    tHead.innerHTML = `
    <tr>
        <th scope="col">區域</th>
        <th scope="col">站點名稱</th>
        <th scope="col">數量(剩餘/空位/總共)</th>
        <th scope="col">地圖</th>
        <th scope="col">經緯度</th>
    </tr>`;

    const tBody = myTable.querySelector(".data_rows");
    tBody.innerHTML = "";

    //將帶入的參數資料作內容的渲染
    youBikeData.forEach((obj) => {
        const tempRow = document.createElement("tr");

        appendTableCell(tempRow, obj.sarea);
        appendTableCell(tempRow, obj.sna);
        appendTableCell(tempRow, `${obj.sbi}/${obj.bemp}/${obj.tot}`);
        //地圖按鈕(font awesome)
        const mapIcon = document.createElement("td");
        mapIcon.setAttribute("role", "button");
        mapIcon.innerHTML = '<i class="fa-solid fa-map-location-dot"></i>';
        mapIcon.addEventListener("click", () => {
            map.panTo([obj.lat, obj.lng], 15);
        });
        tempRow.append(mapIcon);
        //經緯度提示(font awesome)
        const infoIcon = document.createElement("td");
        infoIcon.setAttribute("role", "button");
        infoIcon.setAttribute("data-bs-toggle", "tooltip");
        infoIcon.setAttribute("data-bs-title", `${obj.lat} / ${obj.lng}`);
        infoIcon.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
        tempRow.append(infoIcon);

        tBody.appendChild(tempRow);
    });
    //Bootstrap的Tooltips(提示框)
    enableAllTooltips();
    //Leaflet的Marker(地圖點)
    setMarker();
}

function appendTableCell(row, content) {
    //表格加資料
    const cell = document.createElement("td");
    cell.textContent = content;
    row.appendChild(cell);
}

function initAreaSelect(city) {
    areaSelect.innerHTML = `<option selected value="">請先選擇縣市</option>`;
    if (city === "") return;
    cityArr.find((item) => item.City === city).Districts.forEach((element) => {
        areaSelect.innerHTML += `<option value="${element.District}">${element.District}</option>`;
    });
}

function fetchCityData(url) {
    return fetch(
        "https://raw.githubusercontent.com/YCT06/FileStorage/main/TaiwanAddress_Simple.json"
    ).then((response) => response.json());
}

function fetchYouBikeData(url) {
    return fetch(url).then((response) => response.json());
}

function fetchTaiwanAreaData() {
    
    return fetch("./TaiwanArea.json").then((response) => response.json());
}

function enableAllTooltips() {
    const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
}

//初始化地圖
const map = L.map("map", {
    center: [25.0415001, 121.5372731],
    zoom: 15,
});
// 設定圖資來源
var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
var osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 19 });
map.addLayer(osm);

function setMarker() {
    //如果markers存在, 清空所有markers
    if (markers) markers.clearLayers();
    //重新從資料做marker
    currentCityYouBikeDataArr.forEach((item) => {
        const marker = L.marker([item.lat, item.lng], {
            title: item.sna,
        });

        marker.bindPopup(
            `<b>${item.sna}</b><br>剩餘/空位/總共: ${item.sbi}/${item.bemp}/${item.tot}`
        );
        markers.addLayer(marker);
    });
    map.addLayer(markers);
}
