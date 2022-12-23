# %%
import pandas as pd
import copy
import string
pd.set_option('max_colwidth', 300)

# %%
data = open('interesting_sentences.txt', 'r', encoding = 'utf-8')
next_sentence = ""
last_sentences = []
current_sentences = []
phrases = []
interesting_data = data.read()
interesting_data = interesting_data.split('.')
interesting_phrases = [" good but not great", " big but not large", " huge but not large"," huge but not large"," small but not little"," interesting but not fascinating"
                       ," fat but not overweight"," good but not best"," great but not best"," strange but not weird"," known but not famous"," unusual but not strange"
                       ," possible but not practical"," wrong but not evil"," uncommon but not rare"," small but not tiny"," thin but not skinny"," known but not legendary",
                       " dim but not dark"," sufficient but not ample"," interesting but not exciting"," further but not far"," uncommon but not unusual"," uncommon but not extraordinary"
                       ," bleak but not hopeless" ," clean but not spotless"," unfortunate but not fatal"," unfortunate but not disastrous"," uncomfortable but not painful",
                       " fat but not overweight"," neglected but not forgotten"," alarming but not terrifying"," big but not huge"," thick but not impenetrable"]
for i in range(2, len(interesting_data)):
    
    last_sentence = interesting_data[i - 2] + '. ' + interesting_data[i - 1]
    current_sentence = interesting_data[i]
    
    cleaned_sentence = current_sentence.translate(str.maketrans('', '', string.punctuation))
    for phrase in interesting_phrases:
        if phrase in cleaned_sentence:
            last_sentences.append(last_sentence.replace('\n', ''))
            current_sentences.append(current_sentence.replace('\n', ''))
            phrases.append(phrase)


# %%
data = pd.DataFrame(data = [last_sentences, current_sentences, phrases])
data = data.T
data.columns = ['context', 'premise', 'phrase']

# %%
for i in range(len(data)):
    data.premise[i] = data.premise[i].replace('\'', '')
    data.premise[i] = data.premise[i].replace('\"', '')
    data.context[i] = data.context[i].replace('\'', '')
    data.context[i] = data.context[i].replace('\"', '')
    split_sentence = data.premise[i].split(' ')
    for j in range(len(split_sentence)  - 4):
        if split_sentence[j] == 'very' and split_sentence[j+2] == 'but' and split_sentence[j+3] == 'not':
            copy_list = copy.deepcopy(split_sentence)
            del copy_list[j]
            data.premise[i] = ' '.join(copy_list)


# %%
data['hypothesis'] = data['premise']
remove_index = []
for i in range(len(data)):
    counter = 0
    split_sentence = data.premise[i].split(' ')
    hypothesis = copy.deepcopy(split_sentence)
    premise = copy.deepcopy(hypothesis)
    phrase = data.phrase[i][1:].split(' ')
    j = -1
    while j < len(hypothesis) - 3:
        j = j + 1
        if (hypothesis[j].translate(str.maketrans('', '', string.punctuation)) and hypothesis[j + 1].translate(str.maketrans('', '', string.punctuation)) == phrase[1] and 
            hypothesis[j + 2].translate(str.maketrans('', '', string.punctuation)) == phrase[2] and hypothesis[j + 3].translate(str.maketrans('', '', string.punctuation)) == phrase[3]):
            
            del hypothesis[j]
            del hypothesis[j]
            del hypothesis[j]
            
            del premise[j + 1]
            del premise[j + 1]
            del premise[j + 1]
            counter = 1
    if counter == 0:
        remove_index.append(i)
    data['hypothesis'][i] = ' '.join(hypothesis)
    data['premise'][i] = ' '.join(premise)
data = data[['context', 'premise', 'hypothesis', 'phrase']]
data = data.drop(index=remove_index)
data = data.reset_index(drop=True)

# %%
data = data.sample(frac = 1)


phrases = [' good but not great', ' uncomfortable but not painful', ' small but not tiny', ' uncommon but not rare', ' good but not best', ' big but not huge', ' possible but not practical', ' dim but not dark',
           ' clean but not spotless', ' interesting but not exciting', ' thin but not skinny', ' uncommon but not unusual', ' neglected but not forgotten', ' interesting but not fascinating', ' unfortunate but not fatal',
           ' further but not far', ' known but not famous', ' unusual but not strange', ' big but not large', ' thick but not impenetrable', ' great but not best', ' unfortunate but not disastrous', ' bleak but not hopeless',
           ' fat but not overweight', ' strange but not weird', ' small but not little', ' sufficient but not ample', ' alarming but not terrifying', ' uncommon but not extraordinary']
test_count = [131, 92, 88, 76, 67, 65, 61, 26, 24, 24, 21, 20, 19, 17, 12, 9, 8, 6, 7, 6, 5, 4, 3, 2, 2, 2, 1, 1, 1]
train_count = [600, 80, 80, 40]

test_data = pd.DataFrame([], columns= ['context', 'premise', 'hypothesis', 'phrase'])
train_data = pd.DataFrame([], columns= ['context', 'premise', 'hypothesis',  'phrase'])

for i in range(len(test_count)):
    if len(data[data['phrase'] == phrases[i]]) == 0:
        print (phrases[i])
    test_data = pd.concat([test_data, data[data['phrase'] == phrases[i]][:test_count[i]]])
    
for i in range(len(train_count)):
    train_data = pd.concat([train_data, data[data['phrase'] == phrases[i]][test_count[i]:test_count[i] + train_count[i]]])

train_data = train_data.sample(frac = 1)
test_data = test_data.sample(frac = 1)
train_data.to_csv('train_data.csv', index= False, sep=';')
test_data.to_csv('test_data.csv', index= False, sep = ';')


