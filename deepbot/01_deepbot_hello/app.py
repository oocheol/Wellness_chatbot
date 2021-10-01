#!/usr/bin/python1
# -*- coding: utf-8 -*

from flask import Flask, render_template, request, jsonify


# Flask 서버 설정
app = Flask(__name__, static_url_path='')
app.config['JSON_AS_ASCII'] = False



# API 호출 테스트
@app.route('/hello', methods=['GET'])
def hello():
    response_msg = {
        "message": "안녕하세요!",
    }
    return jsonify(response_msg)


## 메시지 처리
@app.route('/message', methods=['GET', 'POST'])
def chatting():
    message = request.json['message']

    if "안녕" in message :
        response = "안녕하십니까. 식사는 하셨나요?"
    
    # elif "날씨" in message :
    #     # response = openapi.get_weather(today)
    #     response = "현재시각 온도는 23도. 오늘 날씨는 흐리네요."
    else:
        response = "무슨 말씀이신지 모르겠습니다."
    
    response_msg = {
        "message": response,
    }

    return jsonify(response_msg)
    


## HTML 랜더링
@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True, port=5000)
