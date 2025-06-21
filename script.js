document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const getPredictionBtn = document.getElementById('getPredictionBtn');
    const resetBtn = document.getElementById('resetBtn');
    const predictionResultDiv = document.getElementById('predictionResult');
    const userQuestionInput = document.getElementById('userQuestion');
    const magicButton = document.getElementById('magicButton');
    const cardSelectionArea = document.getElementById('cardSelectionArea');
    let selectedCard = null;

    const tarotCards = {
        'card1': { name: '현자 (The Sage)', meaning: '지혜, 경험, 내면의 안내자', detail: '당신은 오늘 중요한 결정을 내릴 때 내면의 지혜를 따르세요. 오랜 경험이 있는 이의 조언을 듣는 것도 좋습니다.' },
        'card2': { name: '별 (The Star)', meaning: '희망, 영감, 치유', detail: '밝은 미래가 당신을 기다립니다. 긍정적인 마음으로 나아가세요. 당신의 꿈이 이루어질 가능성이 높습니다.' },
        'card3': { name: '운명의 수레바퀴 (Wheel of Fortune)', meaning: '변화, 운명, 전환점', detail: '인생의 새로운 국면이 시작될 수 있습니다. 긍정적인 변화를 받아들이고, 기회를 놓치지 마세요.' },
        'card4': { name: '힘 (Strength)', meaning: '용기, 인내, 통제', detail: '당신 안의 강한 힘과 용기를 발휘할 때입니다. 어려움에 직면하더라도 침착하게 인내심을 가지면 극복할 수 있습니다.' },
        'card5': { name: '연인 (The Lovers)', meaning: '선택, 관계, 조화', detail: '중요한 선택의 기로에 설 수 있습니다. 인간관계에서의 조화와 소통이 중요하며, 사랑과 이해가 깊어질 수 있습니다.' },
        'card6': { name: '마법사 (The Magician)', meaning: '창조, 능력, 시작', detail: '새로운 시작을 위한 모든 재능과 도구가 당신에게 있습니다. 아이디어를 현실로 만들 좋은 시기입니다.' },
        'card7': { name: '정의 (Justice)', meaning: '공정함, 균형, 진실', detail: '공정하고 정의로운 판단이 필요한 시기입니다. 모든 상황을 객관적으로 보고 균형을 맞추려고 노력하세요.' },
        'card8': { name: '태양 (The Sun)', meaning: '성공, 행복, 활력', detail: '가장 긍정적인 카드 중 하나입니다. 성공과 행복이 따를 것이며, 활력이 넘치는 하루 또는 시기가 될 것입니다.' },
        'card9': { name: '달 (The Moon)', meaning: '환상, 직관, 잠재의식', detail: '불확실함과 환상이 공존하는 시기입니다. 당신의 직관을 믿고, 내면의 목소리에 귀 기울이세요. 숨겨진 진실을 발견할 수 있습니다.' }
    };

    // 초기 상태 설정
    cards.forEach(card => {
        card.disabled = true;
    });
    getPredictionBtn.disabled = true;
    magicButton.style.display = 'none'; // MAGIC 버튼 숨김
    cardSelectionArea.style.display = 'none'; // 카드 선택 영역 숨김

    // 질문 입력 시 MAGIC 버튼 활성화/비활성화
    userQuestionInput.addEventListener('input', () => {
        const questionText = userQuestionInput.value.trim();
        if (questionText.length > 0) {
            magicButton.style.display = 'block'; // 질문 있으면 MAGIC 버튼 표시
            magicButton.disabled = false;
        } else {
            magicButton.style.display = 'none'; // 질문 없으면 MAGIC 버튼 숨김
            magicButton.disabled = true;
            resetCardSelection(); // 질문이 지워지면 카드 선택 초기화
        }
    });

    // MAGIC 버튼 클릭 시 카드 영역 표시 및 카드 활성화
    magicButton.addEventListener('click', () => {
        if (userQuestionInput.value.trim().length > 0) {
            cardSelectionArea.style.display = 'grid'; // 카드 선택 영역 표시 (CSS의 grid 속성)
            cards.forEach(card => {
                card.disabled = false; // 카드 활성화
            });
            magicButton.disabled = true; // MAGIC 버튼 비활성화 (한 번만 누르도록)
            userQuestionInput.readOnly = true; // 질문 입력창 읽기 전용으로 변경
        }
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.disabled) { // 카드가 비활성화 상태면 클릭 동작 안 함
                return;
            }

            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                selectedCard = null;
            } else {
                if (selectedCard) { // 다른 카드가 이미 선택되어 있으면 해제
                    document.querySelector(`[data-card="${selectedCard}"]`).classList.remove('selected');
                }
                card.classList.add('selected');
                selectedCard = card.dataset.card;
            }
            getPredictionBtn.disabled = (selectedCard === null); // '마음의 버튼' 활성화/비활성화
        });
    });

    getPredictionBtn.addEventListener('click', () => {
        if (selectedCard) {
            displayPrediction();
        } else {
            alert('카드를 한 장 선택해주세요.');
        }
    });

    resetBtn.addEventListener('click', () => {
        resetGame();
    });

    function displayPrediction() {
        const userQuestion = userQuestionInput.value.trim();
        let predictionHtml = '<h2>당신의 예언 결과:</h2>';

        if (userQuestion) {
            predictionHtml += `<p><strong>질문:</strong> ${userQuestion}</p><hr>`;
        } else {
            predictionHtml += `<p><strong>(질문 없이 카드를 뽑으셨습니다.)</strong></p><hr>`;
        }

        const cardData = tarotCards[selectedCard];
        if (cardData) {
            predictionHtml += `
                <div class="card-prediction">
                    <h3>${cardData.name}</h3>
                    <p><strong>예언:</strong></p>
                    <p>${cardData.detail}</p>
                </div>
                <hr>
            `;
        }
        predictionResultDiv.innerHTML = predictionHtml;
        predictionResultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function resetCardSelection() {
        cards.forEach(card => {
            card.classList.remove('selected');
            card.disabled = true;
        });
        selectedCard = null;
        getPredictionBtn.disabled = true;
        cardSelectionArea.style.display = 'none'; // 카드 선택 영역 숨김
    }

    function resetGame() {
        resetCardSelection();
        predictionResultDiv.innerHTML = '';
        userQuestionInput.value = '';
        userQuestionInput.readOnly = false; // 질문 입력창 다시 활성화
        magicButton.style.display = 'none'; // MAGIC 버튼 숨김
        magicButton.disabled = true; // MAGIC 버튼 비활성화
    }
});