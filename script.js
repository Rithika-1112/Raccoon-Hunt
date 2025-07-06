window.addEventListener('click', function startMusic() {
  const audio = document.getElementById("bgMusic");
  if (audio) {
    audio.play().catch(err => console.log("Playback failed:", err));
  }
  window.removeEventListener('click', startMusic);
});


window.onload = function () {
  document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") moveLeft();
    if (event.key === "ArrowRight") moveRight();
  });

  // Unlock audio on first interaction (required by browser autoplay policies)
  let audioUnlocked = false;
  document.addEventListener("keydown", () => {
    if (!audioUnlocked) {
      Object.values(blockAudio).forEach(audio => {
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(() => {});
      });
      audioUnlocked = true;
    }
  }, { once: true });

  const character = document.getElementById("character");

  const blockImages = [
    "media/Untitled design (4).png",
    "media/Untitled design (5).png",
    "media/Untitled design (9).png"
  ];

  const coinImages = [
    "media/Untitled design (1).png",
    "media/Untitled design (2).png",
    "media/Untitled design (3).png"
  ];

  const characterImages = ["media/character-sprite.png"];

  const blockAudio = {
    "media/Untitled design (4).png": document.getElementById("audio1"),
    "media/Untitled design (5).png": document.getElementById("audio2"),
    "media/Untitled design (9).png": document.getElementById("audio3")
  };

  function playCollisionAudio(imageType) {
    const audio = blockAudio[imageType];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Audio play failed:", e));
    }
  }

  function getRandomImage(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
    // Set character image
    if (character) {
        character.style.backgroundImage = `url('${getRandomImage(characterImages)}')`;
    }
    function moveLeft() {
        let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
        left -= 100;
        if(left >= 0) {
            character.style.left = left + "px";
        }
    }
    function moveRight() {
        let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
        left += 100;
        if(left < 500) {
            character.style.left = left + "px";
        }
    }

    var block = document.getElementById("block");
    var counter = 0;
    var speed = 3; // Start slower
    var currentBlockPosition = 0;

    if (block) {
        // Set initial random block image and speed
        block.style.backgroundImage = `url('${getRandomImage(blockImages)}')`;
        block.style.animationDuration = `${speed}s`;

        block.addEventListener('animationiteration', () => {
            var random = Math.floor(Math.random() * 5);
            var blockleft = random * 100;
            block.style.left = blockleft + "px";
            currentBlockPosition = blockleft;
            // Change to random block image
            var selectedImage = getRandomImage(blockImages);
            block.style.backgroundImage = `url('${selectedImage}')`;
            block.dataset.imageType = selectedImage; // Store image type for audio
            counter++;

            if (counter % 3 === 0 && speed > 0.5) {
                speed -= 0.2; // Speed up by decreasing duration
                block.style.animationDuration = `${speed}s`;
            }
        });

        setInterval(function(){
                var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
                var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
                var blockTop = parseInt(window.getComputedStyle(block).getPropertyValue("top"));
            if (Math.abs(characterLeft - blockLeft) < 80 && blockTop < 600 && blockTop > 500){
                    // Play collision audio based on block image
                    var imageType = block.dataset.imageType;
                    if (imageType) {
                        playCollisionAudio(imageType);
                    }

                    // Save coin count before redirecting
                    localStorage.setItem('coinsCollected', coinsCollected);

                    // Add slight delay to let audio play
                    setTimeout(() => {
                        transitionToPage("end.html");
                    }, 200);
                }
            }, 10);
        }



    // Touch controls
    var rightButton = document.getElementById("right");
    var leftButton = document.getElementById("left");
    if (rightButton) rightButton.addEventListener("touchstart", moveRight);
    if (leftButton) leftButton.addEventListener("touchstart", moveLeft);

    // Coin logic
    var coin = document.getElementById("coin");
    var coinsCollected = 0;

    if (coin) {
        var coinCounter = 0;
        var coinSpeed = 3; // Start slower
        var scoreElement = document.getElementById("score");
        var coinCollected = false;

        // Set initial coin position and image
        function resetCoinPosition() {
            var random = Math.floor(Math.random() * 5);
            var coinLeft = random * 100;

            // Make sure coin doesn't spawn in same position as block
            var attempts = 0;
            while (coinLeft === currentBlockPosition && attempts < 10) {
                random = Math.floor(Math.random() * 5);
                coinLeft = random * 100;
                attempts++;
            }

            coin.style.left = coinLeft + "px";
            coin.style.top = "-100px"; // Reset to top
            coin.style.animation = "coinSlide " + coinSpeed + "s infinite linear";
            coin.style.animationDelay = "0s";
            // Set random coin image
            coin.style.backgroundImage = `url('${getRandomImage(coinImages)}')`;
            coinCollected = false; // Reset collection flag
        }

        resetCoinPosition();

        coin.addEventListener('animationiteration', () => {
            var random = Math.floor(Math.random() * 5);
            var coinLeft = random * 100;

            // Make sure coin doesn't spawn in same position as block
            var attempts = 0;
            while (coinLeft === currentBlockPosition && attempts < 10) {
                random = Math.floor(Math.random() * 5);
                coinLeft = random * 100;
                attempts++;
            }

            coin.style.left = coinLeft + "px";
            coin.style.top = "-100px"; // Ensure it starts from top
            // Change to random coin image
            coin.style.backgroundImage = `url('${getRandomImage(coinImages)}')`;
            coinCounter++;
            coinCollected = false; // Reset for new coin

            if (coinCounter % 3 === 0 && coinSpeed > 0.5) {
                coinSpeed -= 0.2; // Speed up by decreasing duration
                coin.style.animationDuration = `${coinSpeed}s`;
            }
        });

        setInterval(function(){
            var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
            var coinLeft = parseInt(window.getComputedStyle(coin).getPropertyValue("left"));
            var coinTop = parseInt(window.getComputedStyle(coin).getPropertyValue("top"));

            if (Math.abs(characterLeft - coinLeft) < 80 && coinTop < 600 && coinTop > 500 && !coinCollected) {
                coinsCollected++;
                coinCollected = true; // Prevent multiple collections
                console.log("Coin collected! Total coins: " + coinsCollected);

                // Update score display
                if (scoreElement) {
                    scoreElement.textContent = "Score: " + coinsCollected;
                }

                // Stop current animation and reset position immediately
                coin.style.animation = "none";
                coin.style.top = "-200px";
                coin.style.left = "-200px"; // Move completely off screen

                // Reset coin position after a brief delay
                setTimeout(() => {
                    resetCoinPosition();
                }, 200);
            }
        }, 10);
    }
};

window.transitionToPage = function (href) {
  document.body.style.opacity = 0;
  setTimeout(() => {
    window.location.href = href;
  }, 500); // matches CSS transition
};

document.addEventListener('DOMContentLoaded', function () {
  document.body.style.opacity = 1;
});

const countdownEl = document.getElementById("countdown");
const audio = document.getElementById("countdown-audio");
const timings = [
  { time: 0, text: "3" },
  { time: 1000, text: "2" },
  { time: 2000, text: "1" },
  { time: 3000, text: "GO!" },
  { time: 4000, text: "" } 
];

function startcountdown() {
audio.play();
   timings.forEach(({ time, text }) => {
     setTimeout(() => {
        countdownEl.textContent = text;
         countdownEl.style.opacity = text ? 1 : 0;
     }, time);
    });
}
