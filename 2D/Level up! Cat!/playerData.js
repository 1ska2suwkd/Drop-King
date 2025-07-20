// playerData.js

// 플레이어 데이터 객체 (발견한 아이템은 Set으로 관리)
export const playerData = {
  discoveredItems: new Set()
};

// 데이터를 localStorage에 저장하는 함수
export function saveData() {
  // Set은 JSON으로 바로 변환되지 않으므로 배열로 변환해서 저장
  const dataToSave = {
    discoveredItems: Array.from(playerData.discoveredItems)
  };
  localStorage.setItem('myGameData', JSON.stringify(dataToSave));
  console.log('데이터가 저장되었습니다: ', dataToSave);
}

// localStorage에서 데이터를 불러오는 함수
export function loadData() {
  const savedData = localStorage.getItem('myGameData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    // 불러온 데이터를 다시 Set으로 변환
    playerData.discoveredItems = new Set(parsedData.discoveredItems);
    console.log('데이터를 불러왔습니다.');
  } else {
    console.log('저장된 데이터가 없습니다. 새 게임을 시작합니다.');
  }
}

// 데이터 초기화 함수 추가
export function resetData() {
  playerData.discoveredItems.clear(); // Set의 모든 아이템을 지웁니다.
  saveData(); // 초기화된 데이터를 localStorage에 저장합니다.
  console.log('데이터가 초기화되었습니다.');
}
