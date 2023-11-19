// OpenAI API Key
// const apiKey = "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";

let apiKey;

let systemPrompt;
let messages = [{ role: "system", content: systemPrompt }];

function saveApiKey() {
  var apiKeyInput = document.getElementById("api-key-input");
  apiKey = apiKeyInput.value;
  if (apiKey) {
    // alert("API Key saved successfully!");
  } else {
    alert("Please enter an API key");
  }
}

function saveSystemPrompt() {
  var systemPromptInput = document.getElementById("system-prompt-input");
  systemPrompt = systemPromptInput.value;
  if (systemPrompt) {
    messages = [{ role: "system", content: systemPrompt }]; // Update the messages array here
    // alert("System prompt saved successfully!");
  } else {
    alert("Please enter a system prompt");
  }
}

function sendMessage() {
  console.log("sendMessage function called");

  var message = document.getElementById("message-input");
  console.log("Message input value: ", message.value);

  if (!message.value) {
    message.style.border = "1px solid red";
    return;
  }
  message.style.border = "none";

  var status = document.getElementById("status");
  var btnSubmit = document.getElementById("btn-submit");

  status.style.display = "block";
  status.innerHTML = "Loading...";
  btnSubmit.disabled = true;
  btnSubmit.style.cursor = "not-allowed";
  message.disabled = true;

  console.log("Sending fetch request to OpenAI API");

  // Add the new message to the messages array
  messages.push({ role: "user", content: message.value });

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages, // Send the entire messages array
      temperature: 0.7,
    }),
  })
    .then((response) => {
      console.log("Received response from OpenAI API");
      return response.json();
    })
    .then((response) => {
      console.log("Parsed response JSON: ", response);
      let r = response.choices[0].message.content;
      status.innerHTML = "..";
      showHistory(message.value, r);
    })
    .catch((e) => {
      console.log(`Error -> ${e}`);
      status.innerHTML = "Error, try again later...";
    })
    .finally(() => {
      console.log("Resetting form state");
      btnSubmit.disabled = false;
      btnSubmit.style.cursor = "pointer";
      message.disabled = false;
      message.value = "";
    });
}

function showHistory(message, response) {
  var historyBox = document.getElementById("history");

  // My message
  var boxMyMessage = document.createElement("div");
  boxMyMessage.className = "box-my-message";

  var myMessage = document.createElement("p");
  myMessage.className = "my-message";
  myMessage.innerHTML = message;

  boxMyMessage.appendChild(myMessage);

  historyBox.appendChild(boxMyMessage);

  // Response message
  var boxResponseMessage = document.createElement("div");
  boxResponseMessage.className = "box-response-message";

  var chatResponse = document.createElement("p");
  chatResponse.className = "response-message";
  chatResponse.innerHTML = response;

  boxResponseMessage.appendChild(chatResponse);

  historyBox.appendChild(boxResponseMessage);

  // Scroll to the end
  historyBox.scrollTop = historyBox.scrollHeight;
}
