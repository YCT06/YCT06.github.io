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
const deleteButton = document.getElementById("deleteButton");

// 拿到當前的年分日期
let my_date = new Date();
let my_year = my_date.getFullYear();
let my_month = my_date.getMonth();
let my_day = my_date.getDate();

// 清除表單資料
function clearAll() {
    document.getElementById('eventId').value = '';
    document.getElementById('eventColor').value = '#ff0000';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDescription').value = '';
}
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
        const day = i < 10 ? `0${i}` : i;
        const month = my_month + 1;
        const m = month < 10 ? `0${month}` : month;
        str += `
            <li class="calendar-day" data-date="${my_year}-${m}-${day}" data-bs-toggle="modal" data-bs-target="#exampleModal">
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
    updateCalendar();
});

next.addEventListener("click", function (e) {
    e.preventDefault()
    my_month++;
    if (my_month > 11) {
        my_month = 0;
        my_year++;
    }
    refreshDate();
    updateCalendar();
});

today.addEventListener("click", function (e) {
    location.reload();
});

// 事件監聽-新增表單數據到JSON
saveButton.addEventListener('click', function () {
    // 獲取表單數據
    const eventId = document.getElementById('eventId').value;
    const eventColor = document.getElementById('eventColor').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDescription = document.getElementById('eventDescription').value;

    // 獲取現有的事件數據
    let eventData = getEventData();

    if (!eventId) {
        // 添加新事件
        // 組合為 JSON 對象
        let newEvent = {
            // 使用當前時間戳作為 ID
            "id": Date.now(),
            "color": eventColor,
            "date": eventDate,
            "time": eventTime,
            "title": eventTitle,
            "description": eventDescription
        };

        eventData.events.push(newEvent);
    } else {
        // 編輯現有事件
        const foundEvent = eventData.events.find((eData) => {
            return eData.id == eventId;
        });
        foundEvent.color = eventColor;
        foundEvent.date = eventDate;
        foundEvent.time = eventTime;
        foundEvent.title = eventTitle;
        foundEvent.description = eventDescription;
    }

    // 保存更新後的數據到 localStorage
    saveEventData(eventData);

    // 更新行事曆
    updateCalendar();

    // 模擬使用者點了右上角的XX,(關閉視窗)
    document.getElementById('closeButton').click();
});

// 事件監聽-刪除行程
deleteButton.addEventListener('click', function () {
    const eventId = document.getElementById('eventId').value;
    if (eventId) {
        // 有ID存在時的情況
        let eventData = getEventData();
        const filteredEvents = eventData.events.filter((eData) => {
            return eData.id != eventId;
        });
        eventData.events = filteredEvents;
        clearAll();
        saveEventData(eventData);
    } else {
        // 沒有ID存在時的情況        
        alert("資料不存在");
    }
    updateCalendar();
    // 模擬使用者點了右上角的XX,(關閉視窗)
    document.getElementById('closeButton').click();
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
        const dayElement = document.querySelector(`[data-date="${event.date}"]`);
        if (dayElement) {
            const dayContent = dayElement.querySelector('.day-content');
            const dataDay = document.createElement("div");
            dataDay.id = event.id;
            dataDay.className = "event";
            dataDay.setAttribute("data-bs-toggle", "modal");
            dataDay.setAttribute("data-bs-target", "#exampleModal");
            dataDay.innerHTML = `
                <span class="color-mark" style="background-color: ${event.color};"></span>
                <span class="event-title">${event.title}</span>`;
            dayContent.append(dataDay);
        }
    });

    //讀取localStorage的檔案, 呈現在新增、修改行程畫面
    const events = document.querySelectorAll(".event");
    events.forEach(event => {
        event.addEventListener('click', function (e) {
            // 用事件的id來搜索存檔
            const eventID = e.currentTarget.id
            const storedObject = localStorage.getItem("calendarEvents");
            if (storedObject) {
                const dataObject = JSON.parse(storedObject);
                const foundEvent = dataObject.events.find((eData) => {
                    return eData.id == eventID;
                });
                // 獲取表單數據
                document.getElementById('eventId').value = foundEvent.id;
                // console.log(document.getElementById('eventId').value);
                document.getElementById('eventColor').value = foundEvent.color;
                document.getElementById('eventDate').value = foundEvent.date;
                document.getElementById('eventTime').value = foundEvent.time;
                document.getElementById('eventTitle').value = foundEvent.title;
                document.getElementById('eventDescription').value = foundEvent.description;
            } else {
                console.log("No object found for event ID");
            }
            e.stopPropagation();
        });
    });

    // 讓每個格子的日期, 自動填進表單
    const calendarDays = document.querySelectorAll(`[data-date]`);
    calendarDays.forEach(calendarDay => {
        calendarDay.addEventListener('click', function (e) {
            const targetDate = e.currentTarget.getAttribute("data-date");
            clearAll();
            document.getElementById('eventDate').value = targetDate;
        });
    });
}
updateCalendar();
