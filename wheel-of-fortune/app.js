document.addEventListener('DOMContentLoaded', () => {
    const nameListInput = document.getElementById('nameList');
    const updateWheelBtn = document.getElementById('updateWheelBtn');
    const spinBtn = document.getElementById('spinBtn');
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    
    const resultModal = document.getElementById('resultModal');
    const winnerNameEl = document.getElementById('winnerName');
    const keepBtn = document.getElementById('keepBtn');
    const removeBtn = document.getElementById('removeBtn');

    let names = [];
    let currentRotation = 0; // Cumulative rotation in degrees
    let isSpinning = false;
    let currentWinnerIndex = -1;

    // Palette of vibrant colors
    const colors = [
        '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
        '#22c55e', '#06b6d4', '#3b82f6', '#6366f1',
        '#a855f7', '#ec4899', '#f43f5e'
    ];

    function parseNames() {
        const text = nameListInput.value;
        // Split by newline, comma, or multiple spaces, and filter empty
        const rawNames = text.split(/[\n,]+/).flatMap(n => n.trim().split(/\s{2,}/));
        names = rawNames.map(n => n.trim()).filter(n => n.length > 0);
        
        // Remove duplicates if desired, but for now we allow duplicates
        
        if (names.length > 0) {
            spinBtn.disabled = false;
        } else {
            spinBtn.disabled = true;
        }
        
        drawWheel();
    }

    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (names.length === 0) {
            // Draw empty placeholder
            ctx.beginPath();
            ctx.arc(200, 200, 200, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.font = '20px Kanit';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('กรุณาใส่ชื่อ', 200, 200);
            return;
        }

        const arc = (2 * Math.PI) / names.length;

        for (let i = 0; i < names.length; i++) {
            const startAngle = i * arc;
            const endAngle = startAngle + arc;

            ctx.beginPath();
            ctx.arc(200, 200, 200, startAngle, endAngle);
            ctx.lineTo(200, 200);
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            
            // Draw border
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            // Draw text
            ctx.save();
            ctx.translate(200, 200);
            ctx.rotate(startAngle + arc / 2);
            
            ctx.fillStyle = '#fff';
            ctx.font = '600 16px Kanit';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            
            // Limit text length visually
            let displayText = names[i];
            if (displayText.length > 15) {
                displayText = displayText.substring(0, 15) + '...';
            }
            
            ctx.fillText(displayText, 180, 0);
            ctx.restore();
        }
    }

    function spin() {
        if (isSpinning || names.length === 0) return;
        isSpinning = true;
        spinBtn.disabled = true;

        // Random rotation between 5 and 10 extra turns
        const extraTurns = Math.floor(Math.random() * 5) + 5;
        const randomDegree = Math.floor(Math.random() * 360);
        
        // Calculate new total rotation
        // We add the new rotation to the current rotation so it spins smoothly forward
        currentRotation += (extraTurns * 360) + randomDegree;

        // Apply transition
        canvas.style.transition = 'transform 5s cubic-bezier(0.175, 0.885, 0.32, 1)';
        canvas.style.transform = `rotate(${currentRotation}deg)`;

        // Calculate winner
        // The pointer is at the top (270 degrees in canvas coords, but our text starts at 0 rightwards)
        // With canvas at 0deg, slice 0 is at right (3 o'clock). The pointer is at top (12 o'clock), which is -90deg or 270deg.
        // Actually it's easier to find the angle pointing UP after rotation.
        
        setTimeout(() => {
            isSpinning = false;
            spinBtn.disabled = false;
            
            // Normalize rotation to 0-360
            const actualRotation = currentRotation % 360;
            
            // The pointer is at -90 degrees from the right edge.
            // Slice 0 starts at 0 degrees and goes to 'arc' degrees.
            // When rotated by 'actualRotation', slice 0 is now at (0 + actualRotation).
            // We want to find which slice covers the angle 270 (or -90).
            
            const sliceAngle = 360 / names.length;
            
            // The position at the top is 270 degrees.
            // To find the slice at 270 degrees after 'actualRotation':
            // The inverse rotation to find the original angle that is now at 270:
            let pointerAngle = (270 - actualRotation) % 360;
            if (pointerAngle < 0) pointerAngle += 360;
            
            currentWinnerIndex = Math.floor(pointerAngle / sliceAngle);
            const winner = names[currentWinnerIndex];
            
            showWinnerModal(winner);
            
        }, 5100); // 100ms extra buffer
    }

    function showWinnerModal(name) {
        winnerNameEl.textContent = name;
        resultModal.classList.add('active');
    }

    function hideWinnerModal() {
        resultModal.classList.remove('active');
    }

    function updateTextarea() {
        nameListInput.value = names.join('\n');
    }

    // Event Listeners
    updateWheelBtn.addEventListener('click', parseNames);
    
    spinBtn.addEventListener('click', spin);

    keepBtn.addEventListener('click', () => {
        hideWinnerModal();
    });

    removeBtn.addEventListener('click', () => {
        if (currentWinnerIndex >= 0 && currentWinnerIndex < names.length) {
            names.splice(currentWinnerIndex, 1);
            updateTextarea();
            parseNames(); // Re-draw wheel
            
            // Reset rotation visually without transition so next spin is clean
            canvas.style.transition = 'none';
            currentRotation = currentRotation % 360;
            canvas.style.transform = `rotate(${currentRotation}deg)`;
            
            // Force reflow
            void canvas.offsetWidth;
        }
        hideWinnerModal();
    });

    // Initialize with empty wheel
    drawWheel();
});
