
// 讀取資料
let shopData = []
window.onload = () => {
    fetch("./data/iphone-15-pro.json")
        .then((response) => {
            return response.json()
        })
        .then((Data) => {
            shopData = Data;
        })
        .catch((err) => {
            alert(`error:${err}`);
        });
};

// 點顏色換幻燈片
document.querySelectorAll('.color-option').forEach(button => {
    button.addEventListener('click', () => {
        // 移除所有顏色選項的邊框
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.remove('border-primary', 'border-3', 'border-secondary-subtle');
        });
        // 為選中的顏色添加邊框
        button.classList.add('border-primary', 'border-3');
        // 獲取點擊的按鈕中的 p 標籤中的顏色名稱
        let colorName = button.querySelector('p').id;
        // 基於顏色名稱更新幻燈片
        updateCarousel(colorName);
        // 更換結算的顏色
        let colorCN = button.querySelector('p').textContent
        document.querySelector('.color').innerHTML = colorCN
    });
});

function updateCarousel(colorName) {
    //幻燈片最下面的張數顯示改成四張
    document.querySelector('.carousel-indicators').innerHTML = '';
    document.querySelector('.carousel-indicators').innerHTML = `
    <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="1"
    aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="2"
    aria-label="Slide 3"></button>
    <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="3"
    aria-label="Slide 4"></button>`;

    //改幻燈片
    // let img = shopData.find(item => item.title === model).images.colorName;
    let img = shopData.find(item => item.title === "iPhone 15 Pro").images[colorName]
    document.querySelector('.carousel-inner').innerHTML = '';
    document.querySelector('.carousel-inner').innerHTML = `
    <div class="carousel-item active">
        <img src=${img[0]} class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
        <img src=${img[1]} class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
        <img src=${img[2]} class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
        <img src=${img[3]} class="d-block w-100" alt="...">
    </div>`
}

// 點規格換儲存空間
document.querySelectorAll('.model').forEach(button => {
    button.addEventListener('click', () => {
        // 移除所有顏色選項的邊框(規格按鈕))
        document.querySelectorAll('.model').forEach(btn => {
            btn.classList.remove('border-primary', 'border-3', 'border-secondary-subtle');
        });
        // 為選中的顏色添加邊框(規格按鈕))
        button.classList.add('border-primary', 'border-3');


        // 獲取點擊的按鈕中的規格名稱
        let modelName = button.id;
        // 基於規格名稱修改儲存規格與價格(生成sap按鈕)
        updateStorageAndPrice(modelName);

        // 更換結算的機型
        let modelEN = button.textContent
        document.querySelector('.title').innerHTML = modelEN
        //結算價格清空
        document.querySelector('.final-price').innerHTML = ''
    });
});

// 動態換規格與價格
function updateStorageAndPrice(modelName) {
    let modelData = shopData.find(item => item.title === modelName);
    let modelStorage = modelData.storage;
    let modelPrice = modelData.price;

    let storageDiv = document.querySelector('.storage');
    storageDiv.innerHTML = '';

    modelStorage.forEach((storageOption, index) => {
        let price = modelPrice[index].toLocaleString();
        storageDiv.innerHTML += `
            <div class="col">
                <div class="border border-secondary-subtle rounded-3 p-4 d-flex justify-content-between sap" role="button">
                    <div class="storage-spec">${storageOption}</div>
                    <div class="price">NT$ ${price}</div>
                </div>
            </div>`;
    });

    sapButtonView()

}

function sapButtonView() {
    document.querySelectorAll('.sap').forEach(button => {
        button.addEventListener('click', () => {
            
            document.querySelectorAll('.sap').forEach(btn => {
                btn.classList.remove('border-primary', 'border-3', 'border-secondary-subtle');
            });
            
            button.classList.add('border-primary', 'border-3');

            // 更換結算的價格
            let money = button.querySelector('.price').textContent
            document.querySelector('.final-price').innerHTML = money
        });
    });
}

// 初始的按鈕功能
sapButtonView()
