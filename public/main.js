const socket = io();

const ClientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageTone = new Audio('iphone_text_message.mp3');

// ✅ Load username from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('username');
  if (savedName) {
    nameInput.value = savedName;
  }
  socket.emit('join', nameInput.value || 'anonymous');
});

// ✅ Save username to localStorage on input change
nameInput.addEventListener('input', () => {
  localStorage.setItem('username', nameInput.value);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage() {
  if (messageInput.value.trim() === '') return;

  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date()
  };

  socket.emit('message', data);
  addMessage(true, data);
  messageInput.value = '';
}

socket.on('clients-total', (data) => {
  ClientsTotal.innerText = `Total clients: ${data}`;
});

socket.on('chat-message', (data) => {
  messageTone.play();
  addMessage(false, data);
});

socket.on('feedback', (data) => {
  clearFeedbackmsg();
  const element = document.createElement('li');
  element.classList.add('message-feedback');
  element.innerHTML = `<p class="feedback" id="feedback">${data.feedback}</p>`;
  messageContainer.appendChild(element);
  scrolltoBottom();
});

socket.on('user-activity', (msg) => {
  const el = document.createElement('li');
  el.classList.add('user-activity');
  el.innerText = msg;
  messageContainer.appendChild(el);
  scrolltoBottom();
});

messageInput.addEventListener('focus', () => {
  socket.emit('feedback', { feedback: `✍🏻 ${nameInput.value} is typing...` });
});
messageInput.addEventListener('blur', () => {
  socket.emit('feedback', { feedback: '' });
});

// ✅ Render messages without avatar
function addMessage(isOwn, data) {
  clearFeedbackmsg();
  const li = document.createElement('li');
  li.className = isOwn ? 'message-right' : 'message-left';

  const msg = `<div class="bubble">
      <p class="message">${data.message}</p>
      <span>${data.name} ⚫️ ${moment(data.dateTime).fromNow()}</span>
    </div>`;

  li.innerHTML = msg;
  messageContainer.appendChild(li);
  scrolltoBottom();
}

function scrolltoBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

function clearFeedbackmsg() {
  document.querySelectorAll('li.message-feedback').forEach(el => el.remove());
}
