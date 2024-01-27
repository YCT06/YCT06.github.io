const startBtn = document.querySelector("#start_btn");
const showAnsBtn = document.querySelector("#show_answer_btn");
const gameMsgToast = document.querySelector("#game_msg_toast");
const toastBootstrap = new bootstrap.Toast(gameMsgToast, {
  delay: 1000,
});
const guessInput = document.querySelector("#guess_input");
const guessBtn = document.querySelector("#guess_btn");
const guessHistoryList = document.querySelector("#guess_history_list");

const endGameModal = document.querySelector("#end_game_modal");
const modalBootstrap = new bootstrap.Modal(endGameModal);

const restartBtn = document.querySelector("#restart_btn");
const endGameBtn = document.querySelector("#end_game_btn");

let answer;

guessBtn.addEventListener("click", () => {
  const val = guessInput.value.trim();
  if (!isValidInput(val)) {
    showHint("正則表達式驗證的結果");
    guessInput.value = "";
    return;
  }
  // 通通用正則替換了
  // if (val === "" || isNaN(val)) {
  //   showHint("請輸入合法的數字！");
  //   guessInput.value = "";
  //   return;
  // }

  // if (val.length > 4 || new Set(val).size !== 4) {
  //   showHint("請確認輸入數字數量");
  //   guessInput.value = "";
  //   return;
  // }

  let a = 0;
  let b = 0;
  for (let i = 0; i < answer.length; i++) {
    if (val[i] === answer[i]) {
      a++;
    } else if (answer.includes(val[i])) {
      b++;
    }
  }
  if (a === 4) {
    modalBootstrap.show();
  }
  guessInput.value = "";
  appendHistory(a, b, val);
});

startBtn.addEventListener("click", initGame);

showAnsBtn.addEventListener("click", function () {
  showHint(`答案是：${answer}`);
});

restartBtn.addEventListener("click", initGame);

endGameBtn.addEventListener("click", () => {
  modalBootstrap.hide();
  initGame();
});

function initGame() {
  answer = generateAns();
  guessHistoryList.innerHTML = "";
}

function isValidInput(input) {
  const regex = /^(?!.*(\d).*\1)([0-9]){4}$/;
  return regex.test(input);
}

function generateAns() {
  const numArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  numArr.sort(() => getRandomArbitrary(-1, 1));
  // numArr.sort(() => getRandomArbitrary(-1, 1));
  return numArr.slice(0, 4).join(""); //String
  // return numArr.slice(0,4) //Array
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function showHint(msg = "") {
  gameMsgToast.querySelector(".toast-body").textContent = msg;

  // const toastBootstrap = bootstrap.Toast.getOrCreateInstance(gameMsgToast);

  toastBootstrap.show();
}

function appendHistory(a = 0, b = 0, guessNum = "1234") {
  // guessHistoryList
  // <li class="list-group-item">
  //         <span class="badge bg-danger">0A0B</span> 1234
  //       </li>
  const colorClass = a === 4 ? "bg-success" : "bg-danger";

  guessHistoryList.innerHTML += `
  <li class="list-group-item">
    <span class="badge ${colorClass}">${a}A${b}B</span> ${guessNum}
  </li>`;
}
