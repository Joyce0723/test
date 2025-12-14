document.addEventListener('DOMContentLoaded', function() {
    
    // === SARC-F 問卷計算 ===
    const calculateSarcfButton = document.getElementById('calculate-button');
    if (calculateSarcfButton) {
        const sarcfForm = document.getElementById('sarcf-quiz');
        const resultDisplay = document.getElementById('result-display');
        const scoreDisplay = document.getElementById('score-display');
        const riskDisplay = document.getElementById('risk-display');

        calculateSarcfButton.addEventListener('click', function() {
            let totalScore = 0;
            const questions = ['q_strength', 'q_walking', 'q_rise', 'q_stairs', 'q_falls'];
            
            for (const qName of questions) {
                const selected = sarcfForm.querySelector(`input[name="${qName}"]:checked`);
                if (selected) {
                    totalScore += parseInt(selected.value);
                }
            }

            let riskLevel = '';
            let riskClass = '';
            if (totalScore >= 5) {
                riskLevel = '高風險。建議尋求專業醫療諮詢！';
                riskClass = 'risk-high';
            } else if (totalScore >= 1) {
                riskLevel = '中低風險。請持續注意身體狀況。';
                riskClass = 'risk-moderate';
            } else {
                riskLevel = '低風險。請保持良好生活習慣。';
                riskClass = 'risk-low';
            }

            scoreDisplay.textContent = `您的 SARC-F 總分是：${totalScore} 分`;
            riskDisplay.textContent = `評估結果：${riskLevel}`;
            
            resultDisplay.className = `result-box ${riskClass}`;
            resultDisplay.style.display = 'block';
            resultDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // === 小腿圍測量 ===
    const calculateCalfButton = document.getElementById('calculate-calf');
    if (calculateCalfButton) {
        const calfResultDisplay = document.getElementById('calf-result');
        calculateCalfButton.addEventListener('click', function() {
            const gender = document.getElementById('calf-gender').value;
            const calfCm = parseFloat(document.getElementById('calf-cm').value);
            
            if (isNaN(calfCm) || calfCm <= 0) {
                calfResultDisplay.textContent = '請輸入有效的小腿圍公分數。';
                calfResultDisplay.className = 'result-box risk-moderate';
                calfResultDisplay.style.display = 'block';
                return;
            }

            let threshold = (gender === 'male') ? 34 : 33;
            let riskLevel = '';
            let riskClass = 'risk-low';

            if (calfCm < threshold) {
                riskLevel = `小腿圍 ${calfCm} cm，低於 ${threshold} cm。肌少症潛在風險高！`;
                riskClass = 'risk-high';
            } else {
                riskLevel = `小腿圍 ${calfCm} cm，高於或等於 ${threshold} cm。風險較低。`;
                riskClass = 'risk-low';
            }

            calfResultDisplay.textContent = riskLevel;
            calfResultDisplay.className = `result-box ${riskClass}`;
            calfResultDisplay.style.display = 'block';
        });
    }
    
    // === 指環測試 ===
    const calculateRingButton = document.getElementById('calculate-ring');
    if (calculateRingButton) {
        const ringResultDisplay = document.getElementById('ring-result');
        calculateRingButton.addEventListener('click', function() {
            const selectedRing = document.querySelector('input[name="q_ring"]:checked');
            if (!selectedRing) {
                ringResultDisplay.textContent = '請選擇您的指環測試結果。';
                ringResultDisplay.className = 'result-box risk-moderate';
                ringResultDisplay.style.display = 'block';
                return;
            }
            
            const ringValue = parseInt(selectedRing.value);
            let riskLevel = '';
            let riskClass = '';
            
            if (ringValue === 2) {
                riskLevel = '指環可完全包圍且有空隙。極高風險，表示肌肉量嚴重不足！';
                riskClass = 'risk-high';
            } else if (ringValue === 1) {
                riskLevel = '指環剛好包圍。中度風險，應當開始注意肌肉鍛鍊。';
                riskClass = 'risk-moderate';
            } else {
                riskLevel = '指環無法包圍。低風險，肌肉量初步判斷充足。';
                riskClass = 'risk-low';
            }

            ringResultDisplay.textContent = riskLevel;
            ringResultDisplay.className = `result-box ${riskClass}`;
            ringResultDisplay.style.display = 'block';
        });
    }

    // === 30秒椅子起立測試 ===
    const calculateCstButton = document.getElementById('calculate-cst');
    if (calculateCstButton) {
        const cstResultDisplay = document.getElementById('cst-result');
        const cstThresholds = {
            male: { '60-64': 14, '65-69': 12, '70-74': 12, '75-79': 11, '80-84': 10, '85-89': 8, '90-94': 7 },
            female: { '60-64': 12, '65-69': 11, '70-74': 10, '75-79': 10, '80-84': 9, '85-89': 8, '90-94': 4 }
        };
        
        function getThreshold(gender, age) {
            if (age < 60) return 999;
            const ranges = cstThresholds[gender];
            for (const range in ranges) {
                const [minAge, maxAge] = range.split('-').map(Number);
                if (age >= minAge && age <= maxAge) {
                    return ranges[range];
                }
            }
            return 0;
        }

        calculateCstButton.addEventListener('click', function() {
            const gender = document.getElementById('cst-gender').value;
            const age = parseInt(document.getElementById('cst-age').value);
            const reps = parseInt(document.getElementById('cst-reps').value);

            if (isNaN(age) || isNaN(reps) || age < 60 || reps < 0) {
                cstResultDisplay.textContent = '請輸入有效的 60 歲以上年齡和完成次數。';
                cstResultDisplay.className = 'result-box risk-moderate';
                cstResultDisplay.style.display = 'block';
                return;
            }

            const threshold = getThreshold(gender, age);
            let riskLevel = '';
            let riskClass = 'risk-low';

            if (reps < threshold) {
                riskLevel = `30秒完成 ${reps} 次。低於您年齡層的門檻值 (${threshold} 次)。肌力明顯不足，風險高！`;
                riskClass = 'risk-high';
            } else {
                riskLevel = `30秒完成 ${reps} 次。高於或等於您的門檻值 (${threshold} 次)。肌力尚可。`;
                riskClass = 'risk-low';
            }

            cstResultDisplay.textContent = riskLevel;
            cstResultDisplay.className = `result-box ${riskClass}`;
            cstResultDisplay.style.display = 'block';
        });
    }

    // === 頁面滾動與回到頂部 ===
    const backToTopButton = document.getElementById('back-to-top');
    const header = document.querySelector('header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 200) {
            backToTopButton.style.display = 'block';
            header.classList.add('header-scrolled'); // 這行負責縮小 Header
        } else {
            backToTopButton.style.display = 'none';
            header.classList.remove('header-scrolled');
        }
    });

    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});