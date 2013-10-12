#!/usr/bin/env python
# requires wv on linux
import os
import sys
import re
import shlex
import subprocess
import string

import os.path
import glob
import json
import argparse

import pymongo

from pprint import pprint
from pymongo import MongoClient

conn = MongoClient('localhost', 27017)
db = conn.qbdb

tournaments = db.tournaments
packets = db.packets
tossups = db.tossups
bonuses = db.bonuses

# import lxml.html as HTML

from BeautifulSoup import BeautifulSoup, Comment
from pprint import pprint

#ansregex = '(?i)(answer|asnwer):'
ansregex = '(?i)a..wer:'
class InvalidPacket(Exception):

    def __init__(self, *args):
        self.args = [a for a in args]

    def __str__(self):
        s = '*' * 80 + '\n'
        s += 'There was a problem in packet {0}\n'.format(self.args[0])
        s += '*' * 80 + '\n'

        return s

class InvalidTossup(Exception):

    def __init__(self, *args):
        self.args = [a for a in args]

    def __str__(self):
        s = '*' * 50 + '\n'
        s += 'Invalid tossup {0}!\n'.format(self.args[2])
        s += 'The problem is in field: {0}, which has value: {1}\n'.format(self.args[0], self.args[1])
        s += '*' * 50 + '\n'
        
        return s

class InvalidBonus(Exception):

    def __init__(self, *args):
        self.args = [a for a in args]

    def __str__(self):
        s = '*' * 50 + '\n'
        s += 'Invalid bonus {0}!\n'.format(self.args[2])
        s += 'The problem is in field: {0}, which has value: {1}\n'.format(self.args[0], self.args[1]) 
        s += '*' * 50 + '\n'
        
        return s

class Bonus:
    def __init__(self, leadin='', parts=[], answers=[], values=[], number=''):
        self.leadin = leadin
        self.parts = parts
        self.answers = answers
        self.number = number
        self.values = values
        
    def add_part(part):
        self.parts.append(part)

    def add_answer(answer):
        self.answers.append(answer)

    def to_json(self):
        # return json.dumps({'leadin': self.leadin,
        #                    'parts': self.parts,
        #                    'answers': self.answers,
        #                    'number': self.number,
        #                    'values': self.values})

        parts_arr = []
        for v, p, a in zip(self.values, self.parts, self.answers):
            parts_arr.append({'value': v, 'part': p, 'answer': a})
        
        
        return json.dumps({'leadin': self.leadin,
                           'parts': parts_arr,
                           'number': self.number}) + '\n'

    def is_valid(self):

        self.valid = False
        
        if self.leadin == '':
            raise InvalidBonus('leadin', self.leadin, self.number)
        if self.parts == []:
            raise InvalidBonus('parts', self.parts, self.number)
        if self.answers == []:
            raise InvalidBonus('answers', self.answers, self.number)
        if self.values == []:
            raise InvalidBonus('values', self.values, self.number)

        # for ans in self.answers:
        #    if re.match('answer:', ans) is None:
        #        raise InvalidBonus('answers', self.answers)
        #    if ans == '':
        #        raise Invalidbonus('answers', self.answers)

        for part in self.parts:
            if part == '':
                raise InvalidBonus('parts', self.parts, self.number)

        for val in self.values:
            if val == '':
                raise InvalidBonus('values', self.values, self.number)
            try:
                int(val)
            except ValueError:
                raise InvalidBonus('values', self.values, self.number)

        self.valid = True
        return True

    def __str__(self):

        s = '*' * 50 + '\n'
        s += self.leadin + '\n'

        for p, v, a in zip(self.parts, self.values, self.answers):
            s += '[{0}] {1}\nANSWER: {2}'.format(v, p, a)

        s += '*' * 50 + '\n'
        
        return s
        
class Tossup:
    def __init__(self, question='', answer='', number=''):
        self.question = question
        self.answer = answer
        self.number = number

    def to_json(self):
        return json.dumps({'question': self.question,
                           'answer': self.answer,
                           'number': self.number}) + '\n'

    def is_valid(self):

        self.valid = False
        
        if self.question == '':
            raise InvalidTossup('question', self.question, self.number)

        if self.answer == '':
            raise InvalidTossup('answer', self.answer, self.number)

        # if re.match('answer:', self.answer) is None:
        #        raise InvalidTossup('answer', self.answer)

        self.valid = True
        return True

    def __str__(self):

        s = '*' * 50 + '\n'
        s += '{0}\nANSWER: {1}'.format(self.question, self.answer)
        s += '*' * 50 + '\n'

        return s
    
def empty_tags_left(soup):
    empty_tags = soup.findAll(lambda tag: (tag.string is None or tag.string.strip() == '') and tag.find(True) is None)
    print empty_tags
    if empty_tags == [] or empty_tags is None:
        return False
    else:
        return True
    
def sanitize (html, valid_tags):
    soup = BeautifulSoup(html)
    for comment in soup.findAll(
        text=lambda text: isinstance(text, Comment)):
        comment.extract()
    for tag in soup.findAll(True):
        if tag.name not in valid_tags:
            tag.hidden = True
    
    #print empty_tags_left(soup)
    
    # for some reason while doesn't work, not sure what's up
    for i in range(5):
        #empty_tags_left(soup)
        for tag in soup.findAll(lambda tag: (tag.string is None or tag.string.strip() == '') and tag.find(True) is None):
            tag.extract()

    #soup.encode('iso-8859-1')
    return soup.renderContents()
    #return soup.renderContents().decode('utf8').replace('javascript:', '')

def find_first_tossup (html):
    first_index = next((i for i in range(len(html)) if re.search(ansregex, html[i], re.I)), None)
    return first_index - 1

def find_first_bonus (html):
    first_index = next((i for i in range(len(html)) if re.search('^\[\w*\]|^\(\w*\)', html[i], re.I)), None)
    #this actually finds the first bonus part
    #so return that index - 1 to get the first bonus leadin
    return first_index - 1

def find_last_tossup (html, first_bonus_index):
    reversed = html[0:first_bonus_index][::-1]
    last_index = len(reversed) - find_first_tossup(reversed)
    return last_index - 1

def find_last_bonus (html):
    reversed = html[::-1]
    last_index = len(reversed) - find_first_bonus(reversed)
    return last_index

def packet_json(tossups, bonuses, year=None, tournament=None, author=None):

    try:
        tossup_json, tossup_errors = tossups_json(tossups)
        if tossup_errors > 0:
            raise InvalidPacket('{0} - {1}'.format(tournament, author))
    except InvalidPacket as ex:
        print ex
        
    try:    
        bonus_json, bonus_errors = bonuses_json(bonuses)
        if bonus_errors > 0:
            raise InvalidPacket('{0} - {1}'.format(tournament, author))
    except InvalidPacket as ex:
        print ex

    if year is None:
        year = raw_input('Enter year: ')
    if tournament is None:
        tournament = raw_input('Enter tournament: ')
    if author is None:
        author = raw_input('Enter author: ')
    
    packet_json = '{"year": "' + str(year) + '", "tournament": "' + tournament + '", "author": "' + author + '", ' + tossup_json + ', ' + bonus_json + '}'

    return packet_json

def tossups_json(tossups):

    errors = 0

    tossups = map(lambda text: string.strip(re.sub('^\d*\.', '', text)), tossups)
    #tossups = map(lambda text: re.sub('\'', '\\\'', text), tossups) 
    questions = [tossups[i] for i in range(len(tossups)) if i % 2 == 0]
    questions = map(lambda text: string.strip(re.sub('^\d*\.', '', text)), questions)
    answers = [tossups[i] for i in range(len(tossups)) if i % 2 == 1]
    answers = [tossups[i] for i in range(len(tossups)) if i % 2 == 1]
    answers = map(lambda text: re.sub(ansregex, '', text, re.I), answers)
    answers = map(lambda text: string.strip(text), answers)
    answers = map(lambda text: sanitize(text, ['u', 'b']), answers)
    answers = map(lambda text: re.sub('(?i)<b><u>|<u><b>', '<req>', text), answers)
    answers = map(lambda text: re.sub('(?i)</b></u>|</u></b>', '</req>', text), answers)

    tossups_json = ''
    
    for i, (question, answer) in enumerate(zip(questions, answers)):
        tossup = Tossup(question, answer, i + 1)
        tossups_json += tossup.to_json() + ','
        try:
            tossup.is_valid()
        except InvalidTossup as ex:
            print ex
            print tossup
            errors += 1

    tossups_json = '"tossups": [' + tossups_json[:-1] + ']' + '\n'

    return tossups_json, errors

def bonuses_json(bonuses):

    errors = 0
    
    bonuses_json = ''
    bonuses = map(lambda text: string.strip(re.sub('^\d*\.', '', text)), bonuses)
    bonuses = map(lambda text: re.sub('\'', '\\\'', text), bonuses) 
    leadin_markers = [i for i in range(len(bonuses)) if not re.search('^\[\w*\]|^\(\w*\)|(?i)^(answer|asnwer):', bonuses[i])]
    for i in range(len(leadin_markers[:-1])):
        leadin = bonuses[leadin_markers[i]]
        parts = []
        values = []
        answers = []

        current_bonus = bonuses[leadin_markers[i] + 1:leadin_markers[i+1]]
        #print current_bonus
        for element in current_bonus:
            element = string.strip(element)
            if re.search(ansregex, element):
                answer = string.strip(re.sub(ansregex, '', element))
                answer = sanitize(answer, ['u', 'b'])
                answer = re.sub('(?i)<b><u>|<u><b>', '<req>', answer)
                answer = re.sub('(?i)</b></u>|</u></b>', '</req>', answer)
                answers.append(answer)
            else:
                match = re.search('^(\[\w*\]|\(\w*\))', element)
                val = re.sub('\[|\]|\(|\)', '', match.group(0))
                question = string.strip(re.sub('^(\[\w*\]|\(\w*\))', '', element))
                question = sanitize(question, ['i'])
                parts.append(question)
                values.append(val)

        bonus = Bonus(leadin, parts, answers, values, i + 1)
        bonuses_json += bonus.to_json() + ','
        try:
            bonus.is_valid()
        except InvalidBonus as ex:
            print ex
            print bonus
            errors += 1
            
    bonuses_json = '"bonuses": [' + bonuses_json[:-1] + ']' + '\n'
    
    return bonuses_json, errors

def split_tossups_bonuses(doc_file):

    #curdir = os.path.curdir
    #os.chdir(os.path.abspath(doc_file))

    html_file = doc_file.replace('.doc', '.html')
    valid_tags = ['em', 'strong', 'b', 'i', 'u']
    
    import platform
    if platform.system() == 'Linux':
        #cmd = 'unoconv -f html -o "' + html_file + '" "' + doc_file + '"'
        #valid_tags.append('p')
        cmd = 'wvHtml "{0}" "{1}"'.format(doc_file, html_file)
    if platform.system() == 'Darwin':
        cmd = 'textutil -convert html \"' + doc_file + '\"'

    cmd = shlex.split(cmd)

    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, errors = p.communicate()
    
    # print doc_file, html_file
    f = open(html_file, 'r')

    html = ''
    
    for line in f.readlines():
        html += line
    f.close()
    
    #html = sanitize(html, valid_tags).split('\n')
    html = re.compile('\n|\r\n').split(sanitize(html, valid_tags))
    html = map(lambda text: string.strip(text), html)
    html = filter(lambda text: text != '', html)

    f = open(html_file, 'w')
    for line in html:
        f.write(line + '\n')

    return handle_html(html_file)


def handle_html(html_file):
    f = open(html_file, 'r')
    html = map(string.strip, f.readlines())
    
    first_tossup = find_first_tossup(html)
    first_bonus = find_first_bonus(html)

    last_tossup = find_last_tossup(html, first_bonus)
    last_bonus = find_last_bonus(html)

    tossups = html[first_tossup:last_tossup]
    bonuses = html[first_bonus:last_bonus]
    
    cleaned_tossups = [line for line in tossups if len(line) > 7]
    cleaned_bonuses = [line for line in bonuses if len(line) > 7]
    
    cleaned_tossups = map(lambda text: string.strip(re.sub('<u></u>', '', text, re.I)), cleaned_tossups)          
    cleaned_tossups = map(lambda text: string.strip(re.sub('<b></b>', '', text, re.I)), cleaned_tossups)
    cleaned_tossups = map(lambda text: string.strip(re.sub('<u></u>', '', text, re.I)), cleaned_tossups)
    cleaned_tossups = map(lambda text: string.strip(re.sub('<b></b>', '', text, re.I)), cleaned_tossups)
    
    cleaned_bonuses = map(lambda text: string.strip(re.sub('<u></u>', '', text, re.I)), cleaned_bonuses)          
    cleaned_bonuses = map(lambda text: string.strip(re.sub('<b></b>', '', text, re.I)), cleaned_bonuses)
    cleaned_bonuses = map(lambda text: string.strip(re.sub('<u></u>', '', text, re.I)), cleaned_bonuses)
    cleaned_bonuses = map(lambda text: string.strip(re.sub('<b></b>', '', text, re.I)), cleaned_bonuses)
    
    return cleaned_tossups, cleaned_bonuses

def process_dir_super(doc = True):
    ext = 'doc' if doc else 'html'
    file_fn = split_tossups_bonuses if doc else handle_html
    print ext
    def process_dir(arg, dirname, fnames):
        fnames = filter(lambda text: re.search('\.'+ext, text), fnames)
        tournament_json = ''
        conf = None
        
        num_packets = len(fnames)
        
        if fnames == []:
            return

        conf_path = os.path.join(dirname, 'config.json')
        
        if os.path.exists(conf_path):
            conf = json.load(open(conf_path, 'r'))
        else:
            #shouldn't go down here if we're reading html files
            conf_file = conf_gen(dirname, '*.doc')
            conf = json.load(open(conf_file, 'r'))

        if conf:
            year = conf['year']
            tournament = conf['tournament']

            for packet in conf['packets']:
                filename = os.path.splitext(packet['filename'])[0] + '.' + ext
                author = packet['author']
                
                tossups, bonuses = file_fn(os.path.join(dirname, filename))
                tournament_json += packet_json(tossups, bonuses, year, tournament, author) + ','
            
        else:
            year = raw_input('Enter year: ')
            tournament = raw_input ('Enter tournament: ')
        
            for fname in fnames:
                print fname
                filename = os.path.join(os.path.abspath(dirname), fname)
            
                author = raw_input('Enter author: ')

                tossups, bonuses = file_fn(filename)
                tournament_json += packet_json(tossups, bonuses, year, tournament, author) + ','
            
        tournament_json = '{"tournament": "' + tournament +\
         '", "year": "' + str(year) +\
         '", "numPackets": "' + str(num_packets) +\
         '", "packets": [' + tournament_json[:-1] + '] }'
        
        tournament_json_file = os.path.join(dirname, '{0} - {1}.json'.format(year, tournament))

        file = open(tournament_json_file, 'w')
        file.write(tournament_json)
        file.close()
        #json.dump(tournament_json, open(tournament_json_file, 'w+'))
        
        print 'Tournament exported to ' + tournament_json_file
    return process_dir

def conf_gen(path, spec):

    os.chdir(path)
    files = glob.glob(spec)

    output_file = open('config.json', 'w+')

    tour_dict = {}
    
    tour_dict['tournament']  = raw_input('Enter tournament: ')
    tour_dict['year'] = raw_input('Enter year: ')

    tour_dict['packets'] = []
    
    for filename in files:
        author = raw_input('Enter the author of {0}: '.format(filename))
        tour_dict['packets'].append({'filename': filename, 'author': author})

    json.dump(tour_dict, output_file)

    print 'dumped config to ' + os.path.join(path, 'config.json')

    return os.path.abspath('config.json')
    
def validate_json(filename):

    try:
        json.load(open(filename, 'r'))
        print "Valid JSON!"
        return True
    except Exception as ex:
        print "Invalid JSON!"
        print ex
        return False

def import_json_into_mongo(filename):

    if not validate_json(filename):
        print 'You have some problems in your JSON file. Correct them and try again.'
        return
    else:
        tournament_json = json.load(open(filename, 'r'))

        tournament = tournament_json['tournament']
        year = tournament_json['year']
        packets_json = tournament_json['packets']
        
        num_packets = len(packets_json)
        
        print 'importing ' + tournament
        
        t_id = tournaments.insert({'tournament': tournament, 'year': year, 'numPackets': num_packets})
       
                
        for packet in packets_json:

            print 'importing packet ' + packet['author']
            
            p_id = packets.insert({'tournament_name': packet['tournament'],
                                   'year': packet['year'], 
                                   'author': packet['author'], 
                                   'tournament': t_id})


            tossups_json = packet['tossups']
            bonuses_json = packet['bonuses']

            for tossup in tossups_json:
                tossup_id = tossups.insert({'question': tossup['question'],
                                            'answer': tossup['answer'],
                                            'packet': p_id,
                                            'tournament': t_id})

            for bonus in bonuses_json:
                parts_arr = []
                for part in bonus['parts']:
                    parts_arr.append({'value': part['value'], 'part': part['part'], 'answer': part['answer']})
                bonus_id = bonuses.insert({'leadin': bonus['leadin'],
                                           'parts': parts_arr,
                                           'packet': p_id,
                                           'tournament': t_id})
    
if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('-f', '--file', dest='file')
    parser.add_argument('-d', '--dir', dest='dir')
    parser.add_argument('-o', '--operation', dest='operation')
    parser.add_argument('-s', '--spec', dest='spec')
    
    args = parser.parse_args()

    if args.dir is not None and args.operation == 'process':
        os.path.walk(args.dir, process_dir_super(not args.spec == 'html'), None)

    if args.file is not None and args.operation is not None:
        if args.operation == 'process':
            tossups, bonuses = split_tossups_bonuses(args.file)
            packet_json = packet_json(tossups, bonuses)

            print packet_json

        if args.operation == 'validate':
            validate_json(args.file)

        if args.operation == 'import':
            import_json_into_mongo(args.file)

    if args.operation == 'conf' and args.dir is not None and args.spec is not None:
        conf_gen(args.dir, args.spec)
