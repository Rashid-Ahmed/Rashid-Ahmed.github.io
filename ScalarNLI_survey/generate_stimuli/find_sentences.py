import json
import os
import sys
import gzip
import logging

JSON_DATA_DIR = '/local/seschust/c4/en'
FILE_DIR = 'file_names'
FILE_NAME = sys.argv[1]
FILES_PATH = os.path.join(FILE_DIR, FILE_NAME)
logging.basicConfig(filename="log.txt", level=logging.INFO)

files = open(FILES_PATH, 'r')
files = files.read().split(' ')
interesting_texts = []
counter = 0
for file_name in files:
    with gzip.open(os.path.join(JSON_DATA_DIR, file_name), mode="rt") as f:
        if counter == 0:
            logging.info(file_name + " loading successful")
        for line in f:
            json_file = json.loads(line)
            if (" good but not great " in json_file['text'] or " big but not large " in json_file['text'] or " large but not huge " in json_file['text'] or " small but not little " in json_file['text'] or " interesting but not fascinating " in json_file['text'] or " fat but not overweight " in json_file['text'] or " good but not best " in json_file['text'] or " great but not best " in json_file['text'] or " strange but not weird " in json_file['text'] or " known but not famous " in json_file['text'] or " unusual but not strange " in json_file['text'] or " possible but not practical " in json_file['text'] or " wrong but not evil  " in json_file['text'] or " uncommon but not rare " in json_file['text']):
                interesting_texts.append(json_file['text'])
        
    logging.info(file_name + " searching is completed")

with open('interesting_sentences.txt', 'a') as f:
    f.write('\n\n\n'.join(interesting_texts).encode('utf8'))
            
