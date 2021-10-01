window.onload = function () {

    // 메시지 변수 생성
    var mode = 0 // 0: TEXT 1: MIC
    var message = ""
    var messagetmp = ""

    var synthesis = window.speechSynthesis

    // 설명
    var utterance = new SpeechSynthesisUtterance()

    utterance.text = message
    utterance.lang = 'ko-KR' // 언어 지정; 영어 -> 'en-US'
    // utterance.lang = 'en-US' // 언어 지정; 영어 -> 'en-US'
    utterance.volume = "1" // 소리 크기 값; 최소값: 0, 최댓값: 1
    utterance.pitch = "1" // 음높이, 음의 고저의 정도; 최솟값: 0, 최댓값: 2
    utterance.rate = "1" // 속도; 최솟값: 0.1, 최댓값: 10

    // 음성 인식 객체 생성
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()

    recognition.lang = 'ko-KR' // 언어 지정;
    // recognition.lang = 'en-US' // 언어 지정; 영어 -> 'en-US' 영어 -> 'en-US'
    recognition.interimResults = false // 음성인식 중간에 결과를 반환할지 여부
    recognition.continuous = false // 음성인식에 대해 연속 결과를 반환할지 여부
    recognition.maxAlternatives = 1 // 음성인식 결과 최대 수; 기본 값: 1

    // 음성 인식 서비스 결과가 반환 시 실행되는 이벤트
    recognition.onresult = function (event) {
        console.log('recognition.onresult')
        var current = event.resultIndex
        var transcript = event.results[current][0].transcript

        // 음성의 반복되는 버그를 잡기 위함 (수정하지 않는 것을 추천)
        var repeatBug = (current == 1 && transcript == event.results[0][0].transcript)
        if (!repeatBug) {
            messagetmp += transcript
        }

        submitMessage(messagetmp)
    }

    // 음성인식 서비스가 끊어졌을 때의 이벤트
    recognition.onend = function () {
        console.log('recognition.onend')
        console.log('mode', mode)
        if (messagetmp === "") {
            if (mode == 1) {
                $('#mic').removeClass('active')
            }
        }
    }

    utterance.onend = function () {
        messagetmp = ''
        if (mode == 1) {
            recognition.start()
        }
    }

    function submitMessage(msg) {
        $('.history').prepend('<p> ME: ' + msg + '</p>')

        $.ajax({
            url: '/message',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                message: msg
            }),
            success: function (res) {
                try {
                    const message = res.message
                    const sentiment = res.sentiment

                    console.log('message', message)
                    console.log('sentiment', sentiment)

                    speak(message)
                    meta(sentiment)

                } catch (e) {
                    speak("이해를 하지 못했어요.")
                }
            }
        })
    }

    $("#user_message").keydown(function (key) {
        if (key.keyCode == 13) {
            messagetmp = $('input#user_message').val()
            $('input#user_message').val('')
            
            // 메시지의 내용을 파이썬이 처리 할 수 있게 보내고 응답을 기다림
            submitMessage(messagetmp)
            return
        }
    })

    $('#mic').on('click', function (event) {
        var flag = $('#mic').hasClass('active')

        if (flag) {
            mode = 0
            $('#mic').removeClass('active')
        } else {
            mode = 1
            $('#mic').addClass('active')

            messagetmp = ''
            if (messagetmp.length) {
                messagetmp += ' '
            }
            recognition.start()
        }
    })

    function speak(message) {
        utterance.text = message
        synthesis.speak(utterance)
        $('.history').prepend('<p> BOT: ' + utterance.text + '</p>')
    }

    function meta(sentiment) {
        if(sentiment) {
            sentiment = Number(sentiment)
            if (Number(sentiment) > 0.5) {
                sentiment = '긍정적 감정상태'
            } else {
                sentiment = '부정적 감정상태'
            }

            $('#ai-meta-text').text(sentiment)
        } 
    }
}
