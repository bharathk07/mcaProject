// DOM
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatSend = document.querySelector('#chat-send');
const messageContainer = document.querySelector('.messages');
const sendImg = document.querySelector('#send-img');
const loader = document.querySelector('.loader');


// OpenAI API
const OPENAI_MODEL = 'gpt-3.5-turbo'; 
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'; 
let apiKey = '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';
const messages = [
    {"role":"system", "content":"You are an AI assistant, expert only in fashion design"},
    {"role":"system","content": "You are unable to answer to the questions apart from fashion or fashion design"},
    {"role":"system","content":"You cannot say jokes"},
    {"role":"system","content":"You cannot give suggestions to any questions apart from fashion or fashion desgin"},
    {"role":"system", "content":"If you are unsure or do not know the answer please use the phrase\"Sorry! I cannot answer that\""},
    {"role":"system", "content":"Please do not use any URL's as answers to the questions"}
]; // store previous messages to remember whole conversation

const greet = [
    {"role": "system", "content": "assistant", "content": "You greet by Welcome!"}
];

function botMessage(){
    fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
              
        },
        body: JSON.stringify(
            {
                "model": OPENAI_MODEL,
                "messages":greet

              }
            
        )
    })
    .then(response => response.json())
    .then(data => {
        const responseMessage = data.choices[0].message;
        addMessage(responseMessage.content, false);
        greet.push(responseMessage);
    })
    .catch(() => {
        addMessage('Oops! Something went wrong. Please try again later.', false);
    });

}


// Function to add a chat message to the container
function addMessage(message, isUser) {
    const botDiv = document.createElement('div');
    botDiv.classList.add('botDiv');
    const userDiv = document.createElement('div');
    userDiv.classList.add('userDiv');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
     if(isUser == false){   
        const botImg = document.createElement('img');
        botImg.src = "images/bot.png";
        botImg.classList.add('bot-img');
        messageDiv.classList.add('bot-message');
        messageDiv.textContent = message;
        botDiv.append(botImg); 
        botDiv.append(messageDiv);
        messageContainer.append(botDiv); 
    }
    else{
        const userImg = document.createElement('img');
        userImg.src = "images/user.png";
        userImg.classList.add('user-img');
        messageDiv.classList.add('user-message');
        messageDiv.textContent = message;
        userDiv.append(messageDiv);
        userDiv.append(userImg); 
        messageContainer.append(userDiv); 
    }
    

    // Scroll to the bottom of the chat container
    messageContainer.scrollTop = messageContainer.scrollHeight;
}



// Function to handle user input
function handleUserInput(event) {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (message !== '') {
        messages.push({
            'role': 'user',
            'content': message
        });
        addMessage(message, true);
        chatInput.value = '';
        showLoader();
        // Other request body from here https://platform.openai.com/docs/api-reference/chat/create
        fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
                  
            },
            body: JSON.stringify(
                {
                    "model": "gpt-3.5-turbo",
                    "messages":messages

                  }
                
            )
        })
        .then(response => response.json())
        .then(data => {
             hideLoader();
            const responseMessage = data.choices[0].message;
            addMessage(responseMessage.content, false);
            messages.push(responseMessage);
        })
        .catch(() => {
            hideLoader();
            addMessage('Oops! Something went wrong. Please try again later.', false);
        });
    }
}


// Function to show the loader icon
function showLoader() {
    loader.style.display = 'inline-block';
    chatSend.disabled = true;
}

// Function to hide the loader icon
function hideLoader() {
    loader.style.display = 'none';
    chatSend.disabled = false;
}

// Ask user to input his/her API Key
function checkAPIKey() {
    if (!apiKey) apiKey = prompt('Please input OpenAI API Key.');
    if (!apiKey) alert('You have not entered the API Key. The application will not work.');
}

// Add an event listener to the form
chatForm.addEventListener('submit', handleUserInput);


// check
checkAPIKey();