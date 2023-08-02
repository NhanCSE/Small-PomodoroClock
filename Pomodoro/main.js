(function () {

	
	//Declare vars
	

	const fehBody = document.body;
	const workDurationInput = document.getElementById("work-duration");
	const restDurationInput = document.getElementById("rest-duration");
	const circleProgress = document.querySelector(".circle-progress");
	const timerTime = document.getElementById("feh-timer-time");
	
	const btnToggleSettings = document.getElementById('feh-toggle-settings');
	const btnCloseSettings = document.getElementById('feh-close-settings');

	let workDuration = parseInt(workDurationInput.value) * 60;
	let restDuration = parseInt(restDurationInput.value) * 60;
	let remainingTime = workDuration;
	let isPaused = true;
	let isWorking = true;
	let intervalId;
	let audioElement;
	const completedSessionsElement = document.getElementById("feh-completed-sessions");
	let completedSessions = 0;
		
	
	 
	// Pomodoro overlay screen
	

	window.addEventListener("load", () => {
		fehBody.classList.add('page-loaded');
	});
	
	
	
	// Toggle settings screen
	
	
	function setBodySettings() {
		fehBody.classList.contains('settings-active')
		  ? fehBody.classList.remove('settings-active')
		  : fehBody.classList.add('settings-active');
	  }
	  
	  function toggleSettings(event) {
		if (event.type === 'click') {
		  setBodySettings();
		} else if (event.type === 'keydown' && event.keyCode === 27) {
		  fehBody.classList.remove('settings-active');
		}
	  }
	  
	btnToggleSettings.addEventListener('click', toggleSettings);
	btnCloseSettings.addEventListener('click', toggleSettings);
	document.addEventListener('keydown', toggleSettings);
	  
	
	
	function playMusic(isWorking)  {
		if(!isPaused) {
			audioElement = isWorking ? new Audio('work.mp3') : new Audio('rest.mp3');
			audioElement.play();
		}
	}
	function pauseMusic() {
		audioElement.pause();
		audioElement.currentTime = 0;
	}
	// Play button is clicked + start timer
	

	const startBtn = document.getElementById("start-btn");
	startBtn.addEventListener("click", () => {
		isPaused = false;
		fehBody.classList.add('timer-running');

		/** 
		* Is work timer
		*/
		if (isWorking) {
			fehBody.classList.remove('timer-paused');	
			playMusic(isWorking);		
		}
		/** 
		* or rest timer
		*/
		else {
			fehBody.classList.add('rest-mode');
			fehBody.classList.remove('timer-paused');
			pauseMusic();
			playMusic(isWorking);		
		}

		if (!intervalId) {
			intervalId = setInterval(updateTimer, 1000);
		}
	});
	
	
	
	//Pause button is clicked 
	
	
	const pauseBtn = document.getElementById("pause-btn");
	pauseBtn.addEventListener("click", () => {
		isPaused = true;

		fehBody.classList.remove('timer-running');
		fehBody.classList.add('timer-paused');
		pauseMusic();

		// document.title = "Timer Paused";
	});
	
	
	
	//Get work / rest times from settings
	

	workDurationInput.addEventListener("change", () => {
		workDuration = parseInt(workDurationInput.value) * 60;
		if (isWorking) {
			remainingTime = workDuration;			
			updateProgress();
		}
	});

	restDurationInput.addEventListener("change", () => {
		restDuration = parseInt(restDurationInput.value) * 60;
		if (!isWorking) {
			remainingTime = restDuration;
			updateProgress();
		}
	});
	
	

	// Timer
	

	function updateTimer() {


		if (!isPaused) {
			remainingTime--;
			/** 
			* When timer stops running
			*/
			
			if (remainingTime <= 0) {
				isWorking = !isWorking;
				remainingTime = isWorking ? workDuration : restDuration;

				/** 
				* Check what timer (work/rest) has just finished
				*/
				if(!isWorking) {
					/** 
					* Increment the completed sessions counter and update the display
					*/
					fehBody.classList.add('rest-mode');
					fehBody.classList.remove('timer-running');

					completedSessions++;
					completedSessionsElement.textContent = completedSessions;
					
					console.log(completedSessions);
				} 
				else {
					fehBody.classList.remove('rest-mode');
					fehBody.classList.remove('timer-running'); 
				}

				/** 
				* Switch alarm pause music
				*/
				pauseMusic();

				/** 
				* Timer has finished
				*/
				isPaused = true;
				fehBody.classList.remove('timer-work-active');
			}

			document.title = timerTime.textContent = formatTime(remainingTime);

			updateProgress();

		}
	}
	
	
	
	//Update circle
	

	function updateProgress() {

		const radius = 45;
		const circumference = 2 * Math.PI * radius;

		const totalDuration = isWorking ? workDuration : restDuration;
		const dashOffset = circumference * remainingTime / totalDuration;
		
		circleProgress.style.strokeDashoffset = dashOffset;
		timerTime.textContent = formatTime(remainingTime);

	}

	 
	// Format time
	

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	}
	
	updateProgress();

})();