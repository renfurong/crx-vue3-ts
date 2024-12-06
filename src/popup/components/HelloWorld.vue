

<template>
<div>
  <h1>hello</h1>
  <n-button @click="sendToContent">inject btn</n-button>
</div>
</template>
<script setup lang="ts">

const obj = ref({
  firstName: 'xxxx',
  middleName: 'yyyy',
  lastName: 'zzzz',
  gender: 'Male',
  dob: '',
  ssn: '',
  driversLicenseNumber: '',
  phoneNumber: '',
  email: '',
  address: '',
  vin: "",
  year: '',
  makeModel: '',
  note: '',
  ownership: '',
  useage: '',
  mileage: '',
  // submissionDate:'',
  lineOfProduct:'xxxx',
})

// 给content.js发送消息
async function sendToContent() {

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log('Current tab URL: ' + tabs[0].url);
  });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    return
  }
  console.log("start send to content.js");
  const response = await chrome.tabs.sendMessage(tab.id as number, { show: true, data: obj.value  });
  console.log(response.data)
}

</script>
<style scoped>

</style>
