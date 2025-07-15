const socket = io();

const ClientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageTone = new Audio('iphone_text_message.mp3');

// ✅ File upload elements
const fileBtn = document.getElementById('fileBtn');
const fileInput = document.getElementById('fileInput');

// ✅ When the app loads
window.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('username');

  // If saved name exists, show it, otherwise show hint
  if (savedName) {
    nameInput.value = savedName;
  } else {
    nameInput.value = "anonymous (click to change)";
  }

  socket.emit('join', nameInput.value || 'Anonymous');

  // ✅ Update placeholder sample times to current time
  document.querySelectorAll('#message-container .message span').forEach(span => {
    const now = moment().format('h:mm A');
    span.textContent = `${now} ⚫️ Today`;
  });
});

// ✅ When user focuses on name, clear the hint
nameInput.addEventListener('focus', () => {
  if (nameInput.value === "anonymous (click to change)") {
    nameInput.value = "";
  }
});

// ✅ When user leaves the name box
nameInput.addEventListener('blur', () => {
  if (nameInput.value.trim() === "") {
    // If empty, restore hint
    nameInput.value = "anonymous (click to change)";
  } else {
    // Save the chosen name
    localStorage.setItem('username', nameInput.value);
  }
});

// ✅ Send normal text message
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (messageInput.value.trim() === '') return;

  const data = {
    name: nameInput.value || 'Anonymous',
    message: messageInput.value,
    dateTime: new Date()
  };

  socket.emit('message', data);
  addMessage(true, data);
  messageInput.value = '';
});

// ✅ Show total clients
socket.on('clients-total', (data) => {
  ClientsTotal.innerText = `Total clients: ${data}`;
});

// ✅ Receive text message
socket.on('chat-message', (data) => {
  messageTone.play();
  addMessage(false, data);
});

// ✅ Show a text message
function addMessage(isOwn, data) {
  const li = document.createElement('li');
  li.className = isOwn ? 'message-right' : 'message-left';

  const msg = `<div class="bubble">
      <p class="message">${data.message}</p>
      <span>${data.name} ⚫️ ${moment(data.dateTime).fromNow()}</span>
    </div>`;

  li.innerHTML = msg;
  messageContainer.appendChild(li);
  scrollToBottom();
}

// ✅ Scroll helper
function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

// ✅ ====== FILE UPLOAD FEATURE ======

// Open file picker when 📎 clicked
fileBtn.addEventListener('click', () => fileInput.click());

// When file selected
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      data: reader.result, // Base64 encoded file
      sender: nameInput.value || 'Anonymous',
      dateTime: new Date()
    };

    // Send to server
    socket.emit('file-upload', fileData);

    // Show file in sender chat
    showFileMessage(true, fileData);
  };
  reader.readAsDataURL(file);
});

// Show file in chat (downloadable link)
function showFileMessage(isOwn, fileData) {
  const li = document.createElement('li');
  li.className = isOwn ? 'message-right' : 'message-left';

  const fileLink = `<a href="${fileData.data}" download="${fileData.name}" target="_blank">📄 ${fileData.name}</a>`;

  li.innerHTML = `
    <div class="bubble">
      <p class="message">${fileLink}</p>
      <span>${fileData.sender} ⚫️ ${moment(fileData.dateTime).fromNow()}</span>
    </div>
  `;
  messageContainer.appendChild(li);
  scrollToBottom();
}

// ✅ Receive file from others
socket.on('file-receive', (fileData) => {
  showFileMessage(false, fileData);
});
