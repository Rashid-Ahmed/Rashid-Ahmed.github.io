# %%
import pandas as pd 

# %%
train_data = pd.read_csv('train_data.csv', sep=';').sample(frac=1)
test_data = pd.read_csv('test_data.csv', sep=';').sample(frac=1)
mnli_data = pd.read_csv('same_labels.csv').sample(frac=1)

# %%
def add_data(dataframe):
    for i in range(len(dataframe)):
        if dataframe.premise[i][0] == ' ':
            dataframe.premise[i] = dataframe.premise[i][1:]
        
        if dataframe.context[i][-1] == '.':
            dataframe.premise[i] = dataframe.context[i] + ' ' + dataframe.premise[i]
        else:
            dataframe.premise[i] = dataframe.context[i] + '. ' + dataframe.premise[i]
    return dataframe
train_data = add_data(train_data)
test_data = add_data(test_data)

# %%
for i in range(len(mnli_data)):
    mnli_data['premise'][i] = mnli_data['premise'][i].translate(str.maketrans('', '', '\"\''))
    mnli_data['hypothesis'][i] = mnli_data['hypothesis'][i].translate(str.maketrans('', '', '\"\''))

# %%
num_stims = 80
examples_per_stim = 25

stimuli = "var stims = [];\n"
for stim in range(int(num_stims/2)):   
    stimuli = stimuli + 'stims['+str(stim)+'] = ['
    examples = []
    for i in range(examples_per_stim):
        if i >=20:
            sample = mnli_data.iloc[(stim * 5) + i - 20]
        else:
            sample = train_data.iloc[(stim * 20) + i]
        example = "{" + '\"premise\":'+ "\"" + sample['premise'] + "\"" + ',' +  '\"hypothesis\":' + "\"" + sample['hypothesis'] + "\""+ "}" 
        examples.append(example)
        
    stimuli = stimuli + ', '.join(examples) + '];\n'
    
for stim in range(int(num_stims/2)):   
    stimuli = stimuli + 'stims['+str(40 + stim)+'] = ['
    examples = []
    for i in range(examples_per_stim):
        if i >=20:
            sample = mnli_data.iloc[200 + (stim * 5) + i - 20]
        else:
            sample = test_data.iloc[(stim * 20) + i]
        example ="{" + '\"premise\":' + '\"'+ sample['premise'] + "\"" + ',' +  '\"hypothesis\":' + "\"" + sample['hypothesis'] + "\"" + "}" 
        examples.append(example)
        
    stimuli = stimuli + ', '.join(examples) + '];\n'

# %%
with open ('stimuli.js', 'w', encoding='utf-8') as file:
    file.write(stimuli)
file.close()


