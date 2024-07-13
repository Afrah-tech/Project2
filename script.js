document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-button');
    const resetButton = document.getElementById('reset-button');
    const questionForm = document.getElementById('question-form');
    const form = document.getElementById('options-form');
    const questionInput = document.getElementById('question');
    const optionInput = document.getElementById('option');
    const optionsList = document.getElementById('options-list');
    const questionDisplay = document.getElementById('question-display');
    const resultMessage = document.getElementById('result-message');
    const confettiContainer = document.getElementById('confetti');
    const smiley = document.getElementById('smiley');
    let options = [];
    let question = '';
    let startAngle = 0;
    let arc = Math.PI / (options.length / 2);
    let spinTimeout = null;
    let spinAngleStart = 10;
    let spinTime = 0;
    let spinTimeTotal = 0;

    // Initial draw of the empty pink wheel
    drawWheel();

    questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        question = questionInput.value.trim();
        if (question) {
            questionDisplay.textContent = question;
            questionInput.value = '';
        } else {
            alert('Please enter a question.');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const option = optionInput.value.trim();
        if (option) {
            if (options.includes(option)) {
                alert('This option has already been added.');
            } else {
                options.push(option);
                updateOptionsList();
                optionInput.value = '';
                drawWheel();
            }
        } else {
            alert('Please enter an option.');
        }
    });

    spinButton.addEventListener('click', () => {
        if (!question) {
            alert('Please set a question before spinning the wheel.');
            return;
        }
        if (options.length === 0) {
            alert('Please add some options before spinning the wheel.');
            return;
        }
        spin();
    });

    resetButton.addEventListener('click', () => {
        resetGame();
    });

    function drawWheel() {
        arc = 2 * Math.PI / (options.length || 1); // Avoid division by zero
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (options.length === 0) {
            ctx.beginPath();
            ctx.arc(250, 250, 200, 0, 2 * Math.PI, false);
            ctx.lineTo(250, 250);
            ctx.fillStyle = '#FF69B4'; // Pink color
            ctx.fill();
            ctx.stroke();
            ctx.save();
            ctx.translate(250, 250);
            ctx.fillStyle = "#fff";
            ctx.font = "bold 20px Arial";
            ctx.fillText('Add Options', -ctx.measureText('Add Options').width / 2, 0);
            ctx.restore();
        } else {
            options.forEach((option, i) => {
                const angle = startAngle + i * arc;
                ctx.beginPath();
                ctx.arc(250, 250, 200, angle, angle + arc, false);
                ctx.lineTo(250, 250);
                ctx.fillStyle = getRandomColor(); // Random color for each segment
                ctx.fill();
                ctx.stroke();
                ctx.save();
                ctx.translate(250 + Math.cos(angle + arc / 2) * 150, 250 + Math.sin(angle + arc / 2) * 150);
                ctx.rotate(angle + arc / 2 + Math.PI / 2);
                ctx.fillStyle = "#fff";
                ctx.font = "bold 24px Arial"; // Increased font size
                ctx.fillText(option, -ctx.measureText(option).width / 2, 0);
                ctx.restore();
            });
        }
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function rotateWheel() {
        startAngle += (spinAngleStart * Math.PI) / 180;
        drawWheel();
        spinTime += 30;
        if (spinTime >= spinTimeTotal) {
            stopRotateWheel();
        } else {
            requestAnimationFrame(rotateWheel);
        }
    }

    function stopRotateWheel() {
        const degrees = (startAngle * 180) / Math.PI + 90;
        const arcd = (arc * 180) / Math.PI;
        const index = Math.floor((360 - (degrees % 360)) / arcd);
        ctx.save();
        ctx.font = "bold 30px Arial";
        const text = options[index];
        resultMessage.textContent = question ? `${question} The wheel landed on: ${text}` : `The wheel landed on: ${text}`;
        showConfetti();
        smiley.style.display = 'block';
        ctx.restore();
    }

    function spin() {
        spinAngleStart = Math.random() * 10 + 10;
        spinTime = 0;
        spinTimeTotal = Math.random() * 3000 + 4000;
        rotateWheel();
    }

    function updateOptionsList() {
        optionsList.innerHTML = '';
        options.forEach((option, index) => {
            const li = document.createElement('li');
            li.textContent = `${option} ❌`;
            li.id = index;
            li.classList.add("delete");
            li.addEventListener('click', () => deleteOption(li));
            optionsList.appendChild(li);
        });
    }

    function deleteOption(option) {
        let optionId = option.id;
        options.splice(optionId, 1);
        updateOptionsList();
        drawWheel();
    }

    function showConfetti() {
        confettiContainer.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confettiContainer.appendChild(confetti);
        }
    }

    function resetGame() {
        options = [];
        question = '';
        startAngle = 0;
        spinTimeout = null;
        questionDisplay.textContent = '';
        resultMessage.textContent = 'Spin the wheel to see the result!';
        optionsList.innerHTML = '';
        confettiContainer.innerHTML = '';
        smiley.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWheel();
    }
});a