#!/usr/bin/python
# -*- coding: utf-8 -*

from flask import Flask, render_template, request, jsonify

from brain import get_sentiment
from brain import get_menu_intent, get_sub_intent

from brain import get_response


# Flask 서버 설정
app = Flask(__name__, static_url_path='')


# 메시지 처리
@app.route('/message', methods=['GET', 'POST'])
def chatting():
    message         = request.json['message']
    sentiment       = get_sentiment(message)
    

    menu_intent     = get_menu_intent(message)
    sub_intent      = get_sub_intent(message)
    response        = get_response(menu_intent, sub_intent)
    
    response_msg = {
        "message": response,
        "sentiment": str(sentiment)
    }

    return jsonify(response_msg)


# HTML 랜더링
@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True, port=5000)
