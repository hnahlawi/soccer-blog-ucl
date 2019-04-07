

const postButton = document.getElementById('post-button')

postButton.addEventListener('click', addComment)

var commentSection = document.getElementById('comment-section')

const refreshButton = document.getElementById("refresh-div")

refreshButton.addEventListener('click', refresh)

const roundDropdown = document.getElementById('dropdown1')
const matchDropdown = document.getElementById('dropdown2')

matchDropdown.style.display = "none"

roundDropdown.addEventListener('change', selectMatch)

const goButton = document.getElementById('goButton')

goButton.addEventListener('click', loadMatch)



function addComment(){

	const request = new Request('/currentUserInfo', {
	        method: 'get',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	    });
	let data = {
		match_id: document.getElementById('matchID').innerHTML,
		text: document.getElementById('new-comment-text').value

	}

	fetch(request).then((res)=>{
		return res.json()

	}).then((userInfo)=>{

	var commentBox = document.createElement('div')
	var username = document.createElement('h5')
	var commentText = document.createElement('span')

	commentBox.classList.add('comment-wrapper')
	commentBox.classList.add('comment')

	username.innerHTML = userInfo.username
	commentText.innerHTML = document.getElementById('new-comment-text').value

	document.getElementById('new-comment-text').value = ""
	commentBox.appendChild(username)
	commentBox.appendChild(commentText)
	commentSection.appendChild(commentBox)
	

	})

	

	const commentreq = new Request('/comment', {
	        method: 'post',
	        body: JSON.stringify(data),
	        headers: {
	            'Content-Type': 'application/json'
	        },
	    });

	fetch(commentreq).then((result)=>{

		console.log('posted comment')
	})
	
	$("#comment-section").animate({ scrollTop: $('#comment-section').prop("scrollHeight")}, 500);


}



function refresh(){
	while (commentSection.firstChild) {
    commentSection.removeChild(commentSection.firstChild);
	
	}

    $('#refresh-img').rotate({
      angle: 0,
      animateTo:180
      })

	const request = new Request('/comments/' + document.getElementById('matchID').innerHTML, {
	        method: 'get',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	    });



	fetch(request).then((result)=>{
		return result.json()
	}).then((commentsArray)=>{

		for (let i =0; i < commentsArray.length; i++){


			var commentBox = document.createElement('div')
			var username = document.createElement('h5')
			var commentText = document.createElement('span')

			commentBox.classList.add('comment-wrapper')
			commentBox.classList.add('comment')

			username.innerHTML = commentsArray[i].username
			commentText.innerHTML = commentsArray[i].text

			commentBox.appendChild(username)
			commentBox.appendChild(commentText)
			commentSection.appendChild(commentBox)
			

		}

	})
   

	document.getElementById('post-button').style.display="inline"


	$("#comment-section").animate({ scrollTop: $('#comment-section').prop("scrollHeight")}, 1500);

}




function selectMatch(){

	while (matchDropdown.firstChild) {
    matchDropdown.removeChild(matchDropdown.firstChild);
	
	}


	var round = roundDropdown.options[roundDropdown.selectedIndex].value;




	const request = new Request('/matchesByRound/' + round, {
	        method: 'get',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	    });

	fetch(request).then((res)=>{



		return res.json()

	}).then((result)=>{

		console.log(result)

		var firstOption = document.createElement('option')
		firstOption.value = "Select match:"
		firstOption.innerHTML = "Select match:"
		matchDropdown.appendChild(firstOption)

		for (let i = 0; i < result.length; i++){


			var option = document.createElement('option')
			option.value = result[i]._id

			option.innerHTML = result[i].match_string

			console.log(option)
			matchDropdown.appendChild(option)


		}

	})





	matchDropdown.style.display= "inline"
}



function loadMatch(){
	var round = matchDropdown.options[matchDropdown.selectedIndex].value;

	const span = document.getElementById('selectError')

	if (matchDropdown.style.display == "none" || matchDropdown.value == "Select match:"){
		span.style.display = "inline"

		setInterval(function(){ span.style.display = "none" }, 2000);
		return null

	}

	else{


		const currentMatch = matchDropdown.options[matchDropdown.selectedIndex].value

		document.getElementById('matchID').innerHTML = currentMatch;

		const matchreq = new Request('/match/' + currentMatch, {
	        method: 'get',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	    });

		fetch(matchreq).then((result)=>{
			return result.json()
		}).then((match)=>{


		document.getElementById("match-date").innerHTML = match.date

		const homereq = new Request('/team/' + match.home, {
	        method: 'get',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	    });

		const awayreq = new Request('/team/' + match.away, {
	        method: 'get',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	    });

		fetch(homereq).then((result)=>{
			return result.json()
		}).then((home)=>{

			document.getElementById('home-image').src = "images/" + home.name +".png"
			document.getElementById('home-name').innerHTML = home.name
			document.getElementById('stadium-name').innerHTML = home.stadium


		})


		fetch(awayreq).then((result)=>{
			return result.json()
		}).then((away)=>{


			document.getElementById('away-image').src = "images/" + away.name +".png"
			document.getElementById('away-name').innerHTML = away.name
			document.getElementById('game-div').style.display = "inline"


		})



		})



	}


	refresh()



}