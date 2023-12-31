// 閏年與一般年,月份的天數
const month_leap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const month_normal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// 取DOM節點
const holder = document.getElementById("days");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const ctitle = document.getElementById("calendar-title");
const cyear = document.getElementById("calendar-year");
const saveButton = document.getElementById("saveButton");

// 拿到當前的年分日期
let my_date = new Date();
let my_year = my_date.getFullYear();
let my_month = my_date.getMonth();
let my_day = my_date.getDate();

// 判斷閏年與獲取該月總天數
function daysMonth(month, year) {
    // 如果年份能被4整除
    if (year % 4 === 0) {
        // 但不能被100整除，或者能被400整除
        if (year % 100 !== 0 || (year % 100 === 0 && year % 400 === 0)) {
            return (month_leap[month]); // 是閏年
        }
        else {
            return (month_normal[month]); // 不是閏年
        }
    }
    else {
        return (month_normal[month]); // 不是閏年
    }
}

// 獲取該月第一天是星期幾
function dayStart(month, year) {
    let tmpDate = new Date(year, month, 1);
    return (tmpDate.getDay());
}

// 月曆畫面創建
function refreshDate() {
    let str = "";
    let totalDay = daysMonth(my_month, my_year); // 獲取該月總天數
    let firstDay = dayStart(my_month, my_year); // 獲取該月第一天是星期幾
    let myclass;
    // 月份第一天是星期天值會是0,必須例外處理
    if (firstDay == 0) {
        firstDay = 7
    }
    for (var i = 1; i < firstDay; i++) {
        str += "<li></li>"; // 為起始日之前的日期創建空白節點
    }
    for (var i = 1; i <= totalDay; i++) {
        if ((i < my_day && my_year == my_date.getFullYear() && my_month == my_date.getMonth()) || my_year < my_date.getFullYear() || (my_year == my_date.getFullYear() && my_month < my_date.getMonth())) {
            myclass = " class='pastdays'"; // 當該日期在今天之前時，以淺灰色字體顯示
        } else if (i == my_day && my_year == my_date.getFullYear() && my_month == my_date.getMonth()) {
            myclass = " class='today todaybox'"; // 當天日期以綠色背景突出顯示
        } else {
            myclass = " class='daystocome'"; // 當該日期在今天之後時，以深灰字體顯示
        }
        str += `
            <li data-day="${i}">
                <div${myclass}>${i}</div>
                <div class='day-content'></div>
            </li>`;// 創建日期節點
    }
    holder.innerHTML = str; // 設置日期顯示
    ctitle.innerHTML = month_name[my_month]; // 設置英文月份顯示
    cyear.innerHTML = my_year; // 設置年份顯示
}

refreshDate();

// 事件監聽-月份切換
prev.addEventListener("click", function (e) {
    e.preventDefault()
    my_month--;
    if (my_month < 0) {
        my_month = 11;
        my_year--;
    }
    refreshDate();
});

next.addEventListener("click", function (e) {
    e.preventDefault()
    my_month++;
    if (my_month > 11) {
        my_month = 0;
        my_year++;
    }
    refreshDate();
});

// 事件監聽-新增表單數據到JSON
saveButton.addEventListener('click', function () {
    // 獲取表單數據
    let eventColor = document.getElementById('eventColor').value;
    let eventDate = document.getElementById('eventDate').value;
    let eventTime = document.getElementById('eventTime').value;
    let eventTitle = document.getElementById('eventTitle').value;
    let eventDescription = document.getElementById('eventDescription').value;


    // 使用當前時間戳作為 ID
    let eventId = Date.now();

    // 組合為 JSON 對象
    let newEvent = {
        "id": eventId,
        "color": eventColor,
        "date": eventDate,
        "time": eventTime,
        "title": eventTitle,
        "description": eventDescription
    };

    // 獲取現有的事件數據
    let eventData = getEventData();

    // 添加新事件
    eventData.events.push(newEvent);

    // 保存更新後的數據到 localStorage
    saveEventData(eventData);

    // 更新行事曆
    updateCalendar();
});

// 取得localStorage的內容
// 以calendarEvents作為key
// 初次調用時因為沒有值會生成events屬性
function getEventData() {
    let eventData = localStorage.getItem('calendarEvents');
    return eventData ? JSON.parse(eventData) : { events: [] };
}

// 存入localStorage
// 以calendarEvents作為key
function saveEventData(eventData) {
    localStorage.setItem('calendarEvents', JSON.stringify(eventData));
}

// 刷新月曆, 把事件插進去
function updateCalendar() {
    // 清掉格子的內容
    const allContents = document.querySelectorAll('.day-content');
    allContents.forEach(content => {
        content.innerHTML = "";
    });

    // 獲取現有的事件數據
    const eventData = getEventData();

    // 遍歷事件，將它們添加到相應的日期格子上
    eventData.events.forEach(event => {
        const eventDate = new Date(event.date);
        const dayElement = document.querySelector(`[data-day='${eventDate.getDate()}']`);
        if (dayElement) {
            const dayContent = dayElement.querySelector('.day-content');
            const dataDay = document.createElement("div");
            dataDay.id = event.id;
            dataDay.innerHTML = `
                <div class="event">
                    <span class="color-mark" style="background-color: ${event.color};"></span>
                    <span class="event-title">${event.title}</span>
                </div>`;
            dayContent.append(dataDay);
        }
    });
}
updateCalendar()

