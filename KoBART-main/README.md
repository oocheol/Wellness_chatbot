
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [π€£ KoBART](#kobart)
  - [How to install](#how-to-install)
  - [Data](#data)
  - [Tokenizer](#tokenizer)
  - [Model](#model)
    - [Performances](#performances)
      - [Classification or Regression](#classification-or-regression)
      - [Summarization](#summarization)
  - [Demos](#demos)
  - [Examples](#examples)
  - [Contacts](#contacts)
  - [Changes](#changes)
  - [License](#license)

<!-- /code_chunk_output -->


# π€£ KoBART

[**BART**](https://arxiv.org/pdf/1910.13461.pdf)(**B**idirectional and **A**uto-**R**egressive **T**ransformers)λ μλ ₯ νμ€νΈ μΌλΆμ λΈμ΄μ¦λ₯Ό μΆκ°νμ¬ μ΄λ₯Ό λ€μ μλ¬ΈμΌλ‘ λ³΅κ΅¬νλ `autoencoder`μ ννλ‘ νμ΅μ΄ λ©λλ€. νκ΅­μ΄ BART(μ΄ν **KoBART**) λ λΌλ¬Έμμ μ¬μ©λ `Text Infilling` λΈμ΄μ¦ ν¨μλ₯Ό μ¬μ©νμ¬ **40GB** μ΄μμ νκ΅­μ΄ νμ€νΈμ λν΄μ νμ΅ν νκ΅­μ΄ `encoder-decoder` μΈμ΄ λͺ¨λΈμλλ€. μ΄λ₯Ό ν΅ν΄ λμΆλ `KoBART-base`λ₯Ό λ°°ν¬ν©λλ€.


![](imgs/bart.png)

## How to install

```
pip install git+https://github.com/SKT-AI/KoBART#egg=kobart
```

## Data

| Data  | # of Sentences |
|-------|---------------:|
| Korean Wiki |     5M   |  
| Other corpus |  0.27B    | 

νκ΅­μ΄ μν€ λ°±κ³Ό μ΄μΈ, λ΄μ€, μ±, [λͺ¨λμ λ§λ­μΉ v1.0(λν, λ΄μ€, ...)](https://corpus.korean.go.kr/), [μ²­μλ κ΅­λ―Όμ²­μ](https://github.com/akngs/petitions) λ±μ λ€μν λ°μ΄ν°κ° λͺ¨λΈ νμ΅μ μ¬μ©λμμ΅λλ€.

## Tokenizer

[`tokenizers`](https://github.com/huggingface/tokenizers) ν¨ν€μ§μ `Character BPE tokenizer`λ‘ νμ΅λμμ΅λλ€. 

`vocab` μ¬μ΄μ¦λ 30,000 μ΄λ©° λνμ μμ£Ό μ°μ΄λ μλμ κ°μ μ΄λͺ¨ν°μ½, μ΄λͺ¨μ§ λ±μ μΆκ°νμ¬ ν΄λΉ ν ν°μ μΈμ λ₯λ ₯μ μ¬λ Έμ΅λλ€. 
> π, π, π, π, π€£, .. , `:-)`, `:)`, `-)`, `(-:`...

λν `<unused0>` ~ `<unused99>`λ±μ λ―Έμ¬μ© ν ν°μ μ μν΄ νμν `subtasks`μ λ°λΌ μμ λ‘­κ² μ μν΄ μ¬μ©ν  μ μκ² νμ΅λλ€.


```python
>>> from kobart import get_kobart_tokenizer
>>> kobart_tokenizer = get_kobart_tokenizer()
>>> kobart_tokenizer.tokenize("μλνμΈμ. νκ΅­μ΄ BART μλλ€.π€£:)l^o")
['βμλν', 'μΈμ.', 'βνκ΅­μ΄', 'βB', 'A', 'R', 'T', 'βμ', 'λλ€.', 'π€£', ':)', 'l^o']
```

## Model

| Model       |  # of params |   Type   | # of layers  | # of heads | ffn_dim | hidden_dims | 
|--------------|:----:|:-------:|--------:|--------:|--------:|--------------:|
| `KoBART-base` |  124M  |  Encoder |   6     | 16      | 3072    | 768 | 
|               |        | Decoder |   6     | 16      | 3072    | 768 |


```python
>>> from transformers import BartModel
>>> from kobart import get_pytorch_kobart_model, get_kobart_tokenizer
>>> kobart_tokenizer = get_kobart_tokenizer()
>>> model = BartModel.from_pretrained(get_pytorch_kobart_model())
>>> inputs = kobart_tokenizer(['μλνμΈμ.'], return_tensors='pt')
>>> model(inputs['input_ids'])
Seq2SeqModelOutput(last_hidden_state=tensor([[[-0.4418, -4.3673,  3.2404,  ...,  5.8832,  4.0629,  3.5540],
         [-0.1316, -4.6446,  2.5955,  ...,  6.0093,  2.7467,  3.0007]]],
       grad_fn=<NativeLayerNormBackward>), past_key_values=((tensor([[[[-9.7980e-02, -6.6584e-01, -1.8089e+00,  ...,  9.6023e-01, -1.8818e-01, -1.3252e+00],
```

### Performances

#### Classification or Regression

|   |  [NSMC](https://github.com/e9t/nsmc)(acc)  | [KorSTS](https://github.com/kakaobrain/KorNLUDatasets)(spearman) | [Question Pair](https://github.com/aisolab/nlp_classification/tree/master/BERT_pairwise_text_classification/qpair)(acc) | 
|---|---|---|---|
| **KoBART-base**  | 90.24  | 81.66  | 94.34  |

#### Summarization

*μλ°μ΄νΈ μμ *

## Demos

- <a href="http://52.231.69.211:8081/" target="_blank">μμ½ λ°λͺ¨</a>

<table><tr><td>
  <center><img src="imgs/kobart_summ.png" width="600"/></center>
</td></tr></table>

*μ μμλ [ZDNET κΈ°μ¬](https://zdnet.co.kr/view/?no=20201125093328)λ₯Ό μμ½ν κ²°κ³Όμ*

## Examples

- [KoBART ChitChatBot](https://github.com/haven-jeon/KoBART-chatbot)
- [KoBART Summarization](https://github.com/seujung/KoBART-summarization)
- [NSMC Classification](https://github.com/SKT-AI/KoBART/tree/main/examples)
- [KoBART Translation](https://github.com/seujung/KoBART-translation)
- [LegalQA using Sentence**KoBART**](https://github.com/haven-jeon/LegalQA)


*KoBARTλ₯Ό μ¬μ©ν ν₯λ―Έλ‘μ΄ μμ κ° μλ€λ©΄ PRμ£ΌμΈμ!*

## Contacts

`KoBART` κ΄λ ¨ μ΄μλ [μ΄κ³³](https://github.com/SKT-AI/KoBART/issues)μ μ¬λ €μ£ΌμΈμ.


## Changes

- V0.3
  - ν ν¬λμ΄μ  λ²κ·Έλ‘ μΈν΄ `<unk>` ν ν°μ΄ μ¬λΌμ§λ μ΄μ ν΄κ²°
- V0.2
  - `KoBART` λͺ¨λΈ μλ°μ΄νΈ(μλΈνμ€νΈ sample efficientκ° μ’μμ§)
  - `λͺ¨λμ λ§λ­μΉ` μ¬μ© λ²μ  λͺμ
  - downloder λ²κ·Έ μμ 
  - `pip` μ€μΉ μ§μ

## License

`KoBART`λ `modified MIT` λΌμ΄μ μ€ νμ κ³΅κ°λμ΄ μμ΅λλ€. λͺ¨λΈ λ° μ½λλ₯Ό μ¬μ©ν  κ²½μ° λΌμ΄μ μ€ λ΄μ©μ μ€μν΄μ£ΌμΈμ. λΌμ΄μ μ€ μ λ¬Έμ `LICENSE` νμΌμμ νμΈνμ€ μ μμ΅λλ€.
