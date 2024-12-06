console.log('content.ts');


let objVal: any = {}

const createBtnProducer = () => {
  const producerBtn = document.createElement('div');
  producerBtn.setAttribute('id', 'download');
  producerBtn.setAttribute('class', 'sync-btn');
  producerBtn.innerHTML = 'download'
  producerBtn.addEventListener('click', download);
  return producerBtn;
}

const createBtnProducer1 = () => {
  const producerBtn = document.createElement('div');
  producerBtn.setAttribute('id', 'upload');
  producerBtn.setAttribute('class', 'sync-btn');
  producerBtn.innerHTML = 'upload'
  producerBtn.addEventListener('click', upload);
  return producerBtn;
}

const injectBtnProducer = () => {
  var el = document.querySelector('.ant-modal-header') as any
  console.log(el);
  if (!el) {
    return
  }
  el.classList.add('ant-header-custom')
  el.appendChild(createBtnProducer());
  el.appendChild(createBtnProducer1());
};

// 接受消息 
chrome.runtime.onMessage.addListener((message: any, _, sendResponse: (val: any) => void) => {
  if (message.show) {
    console.log('start to inject');
    sendResponse({ data: "inject successfully" });
    injectBtnProducer()
    console.log(message.data)
    objVal = message.data
  }
  return true
})

const download = () => {
  //  插入popup 数据
  const firstNameEl = document.getElementById('form_item_firstName') as HTMLInputElement

  const genderEl = document.getElementById('form_item_gender') as HTMLInputElement
  if (firstNameEl) {
    firstNameEl.value = objVal?.firstName ?? ''
    let event: any = document.createEvent('Event');
    event.initEvent("input", true, true); //如果是select选择框把"input"改成"change"
    event.eventType = 'message'
    firstNameEl.dispatchEvent(event)
  }


  if (genderEl) {
    //  此方法无法再次更改值
    // selector.innerHTML = `<span class=\"ant-select-selection-search\"><input type=\"search\" id=\"form_item_gender\" autocomplete=\"off\" class=\"ant-select-selection-search-input\" role=\"combobox\" aria-haspopup=\"listbox\" aria-owns=\"form_item_gender_list\" aria-autocomplete=\"list\" aria-controls=\"form_item_gender_list\" aria-activedescendant=\"form_item_gender_list_0\" readonly=\"\" unselectable=\"on\" style=\"opacity: 0;\" aria-expanded=\"false\"></span><span class=\"ant-select-selection-item\" title=\"{${objVal?.gender}}\">${objVal?.gender}</span>`
    let event: any = document.createEvent('Event');
    event.initEvent("input", true, true); //如果是select选择框把"input"改成"change"
    event.eventType = 'message'
    genderEl.dispatchEvent(event)

    setTimeout(() => {
      const els = document.querySelectorAll('.ant-select-item')
      els.forEach((i: any) => {
        if (i?.title && objVal?.gender && i?.title === objVal?.gender) {
          i.click()
        }
      })
    }, 300)

  }

}

// 读取网页内容
const upload = () => {
  // inputs
  const inputs = document.querySelectorAll('input')
  inputs.forEach((input) => {
    if (input.id.includes('gender') || input.id.includes('ownership') || input.id.includes('useage')) {
      return
    }
    console.log(input.id + ': ' + input.value);
  })

  // selectors
  const selectors = document.querySelectorAll('.ant-select-selector')
  selectors.forEach((item) => {
    const input = item.querySelector('input')
    const span = item.querySelector('.ant-select-selection-item')
    if (!input || !span) {
      return
    }
    console.log(input.id + ': ' + span.innerHTML);
  })

  // textarea
  const textareas = document.querySelectorAll('textarea')
  textareas.forEach((textarea) => {
    console.log(textarea.id + ': ' + textarea.value);
  })
}



