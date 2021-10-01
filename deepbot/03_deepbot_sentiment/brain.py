
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import model_from_json
import pickle

tokenizer = Tokenizer()
with open('./model_data/tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)


def convert_data(sentence):
    # 토큰화
    sentence = sentence.split(' ')
    # 정수화
    sentence = tokenizer.texts_to_sequences([sentence])
    # 패딩
    sentence = pad_sequences(sentence,
                             value=0,
                             padding='post',
                             maxlen=50)
    return sentence


def get_sentiment(sentence):

    # 1. 모델 읽기
    with open("./model_data/rnn_sentiment_model.json", "r") as file:
        loaded_model_json = file.read()

    loaded_model = model_from_json(loaded_model_json)
    loaded_model.load_weights('./model_data/rnn_sentiment_model.h5')

    # 2. 문장 전처리
    sentence = convert_data(sentence)
    try:
        # 3. 추론
        result = loaded_model.predict(sentence)
        return result[0][0]
    except:
        return 0

