function prepareSendMail (evt) {
  evt.preventDefault()
  const data = {
    name: formMail.name.value,
    email: formMail.email.value,
    message: formMail.message.value
  }

  const resultContainer = formMailBlock.querySelector('.status')
  resultContainer.innerHTML = 'Ожидание...'

  sendJson('/', data, 'POST', data => {
    formMail.reset()
    resultContainer.classList.remove('badge-danger')
    if (data.status === 'Error') {
      resultContainer.classList.add('badge-danger')
    }
    resultContainer.innerHTML = data.msgemail
  })
}

function sendJson (url, data, method, cb) {
  // eslint-disable-next-line no-undef
  const xhr = new XMLHttpRequest()
  xhr.open(method, url)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = function () {
    let result
    try {
      result = JSON.parse(xhr.responseText)
    } catch (err) {
      // eslint-disable-next-line node/no-callback-literal
      cb({ msg: 'Извините в данных ошибка', status: 'Error' })
    }
    cb(result)
  }
  xhr.send(JSON.stringify(data))
}

const formMailBlock = document.getElementById('mail');
const formMail = document.querySelector('.form-email');
formMail.addEventListener('submit', prepareSendMail);

