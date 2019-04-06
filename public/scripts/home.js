

const postButton = document.getElementById('post-button')

postButton.addEventListener('click', addComment)

var commentSection = document.getElementById('comment-section')

const refreshButton = document.getElementById("refresh-div")

refreshButton.addEventListener('click', refresh)

const roundDropdown = document.getElementById('dropdown1')
const matchDropdown = document.getElementById('dropdown2')

matchDropdown.style.display = "none"

roundDropdown.addEventListener('change', selectMatch)


function addComment(){

	var commentBox = document.createElement('div')
	var username = document.createElement('h5')
	var commentText = document.createElement('span')

	commentBox.classList.add('comment-wrapper')
	commentBox.classList.add('comment')

	username.innerHTML = 'Some User'
	commentText.innerHTML = document.getElementById('new-comment-text').value

	document.getElementById('new-comment-text').value = ""
	commentBox.appendChild(username)
	commentBox.appendChild(commentText)
	commentSection.appendChild(commentBox)
	
	$("#comment-section").animate({ scrollTop: $('#comment-section').prop("scrollHeight")}, 500);


}



function refresh(){

    $('#refresh-img').rotate({
      angle: 0,
      animateTo:180
      })

	$("#comment-section").animate({ scrollTop: $('#comment-section').prop("scrollHeight")}, 1500);

}

function selectMatch(){






	matchDropdown.style.display= "inline"
}
