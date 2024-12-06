console.log('background');

// 给content.js发送消息
// async function sendToContent() {

//   chrome.tabs.query({ active: true }, function (tabs) {
//     console.log('Current tab URL: ' + tabs[0].url);
//   });

//   // active: true,
//   const [tab] = await chrome.tabs.query({ active: true });
//   if (!tab) {
//     return
//   }
//   console.log("start send to content.js");
//   const response = await chrome.tabs.sendMessage(tab.id as number, { greeting: "hello from background" });
//   console.log("sendContentResponse---", response.data)
// }


