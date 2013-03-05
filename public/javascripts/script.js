var submit = document.getElementById('check-btn') 

submit.addEventListener('click', function(e) {
  var request = new XMLHttpRequest()
    , sids = document.getElementById('input-area').value
    , matches = sids.match(/\d+:\d+:\d+/g)
    , alert = document.getElementById('alert')

  alert.classList.add('hidden')

  if (!matches) {
    alert.classList.remove('hidden')
    alert.innerHTML = 'No valid STEAMID given'
    submit.disabled = false
    return
  } else {
    alert.innerHTML = 'Working...'
  }

  //disable button to prevent multiple submissions
  submit.disabled = true
  request.onload = function() {
    if (request.status === 200) {
      var data = JSON.parse(request.responseText)
        , keys = Object.keys(data)
        , tbody = document.getElementById('result-tbody')
        , fragment = document.createDocumentFragment()
        , tr
        , td
      
      for (var i=0, len=keys.length;i<len;i++) {
        tr = document.createElement('tr')
        sidtd = document.createElement('td')
        teamtd = document.createElement('td')
        sidtd.appendChild(document.createTextNode(keys[i]))
        if (!data[keys[i]]) {
          teamtd.appendChild(document.createTextNode('None'))
        } else {
          teamtd.appendChild(document.createTextNode(data[keys[i]]))
        }
        tr.appendChild(sidtd)
        tr.appendChild(teamtd)
        fragment.appendChild(tr)
      }
      //show table
      document.getElementById('results').classList.remove('hidden')
      //reenable button
      submit.disabled = false
      //hide alert
      alert.classList.add('hidden')
      tbody.appendChild(fragment)
    } else {
      alert.innerHTML = 'Something bad happened'
      alert.classList.remove('hidden')
      submit.disabled = false
    }
  }
  request.open('post', '/')
  request.setRequestHeader('Content-Type', 'application/json')
  request.send(JSON.stringify(matches))
}, false)