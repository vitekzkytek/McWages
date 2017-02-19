import csv
import json

inputfile = 'testinput.csv'
infofile = 'testinfo.csv'
countries = {}

with open(inputfile) as f:
    rd = csv.DictReader(f,delimiter=';')
    for row in rd:
        year = row['year']
        id = row['ID']

        d = {}
        d['McWages'] = row['mc_wages'].replace(',','.')
        d['BMPH'] = row['BMPH'].replace(',','.')
        d['BigMacPrice'] = row['big_mac_price'].replace(',','.')
        d['McWages_PPP'] = row['mc_Wages_PPP'].replace(',','.')
        d['MinWage'] = row['MinWage']
        if row['ID'] in countries:
            countries[id][row['year']] = d
        else:
            countries[id] = {}
            countries[id][row['year']] = d


with open(infofile) as f2:
    rd2 = csv.DictReader(f2,delimiter=';')
    for row in rd2:
        id = row['ID']
        countries[id]['ID'] = id
        countries[id]['GDP'] = row['GDP']
        countries[id]['FullName'] = row['Country']
        countries[id]['Population'] = row['Population']
        countries[id]['FXrate'] = row['Fxrate']



dataDict = {}
dataDict['MapTitle'] = 'Main title of the map'
dataDict['seriesDetails'] = {}
dataDict['seriesDetails']['McWages'] = {}
dataDict['seriesDetails']['BMPH'] = {}
dataDict['seriesDetails']['BigMacPrice'] = {}
dataDict['seriesDetails']['McWages_PPP'] = {}
dataDict['seriesDetails']['MinWage'] = {}
dataDict['seriesDetails']['McWages']['desc'] = 'McWages (USD)'
dataDict['seriesDetails']['BMPH']['desc'] = 'Big Macs per hour (USD)'
dataDict['seriesDetails']['BigMacPrice']['desc'] = 'Big Mac Price (USD)'
dataDict['seriesDetails']['McWages_PPP']['desc'] = 'McWages (PPP)'
dataDict['seriesDetails']['MinWage']['desc'] = 'Is Minimum wage?'



dataDict['Countries'] = countries


fJson = open('data.js','w')
json1 = json.dumps(dataDict,ensure_ascii=False)
fJson.write('var data = ' + json1)
fJson.close()

# # -*- coding: utf-8 -*-
# import csv
#
# s = u'var data = { "chartTitle":"Predátorské časopisy ve Scopusu", "yLabel":"Scimago Journal Rank", "xLabel": "% autorů z rozvinutých zemí", "points" :{'
#
# jrns = []
#
# i=0
# with open('inputData.csv') as f:
#     rd = csv.DictReader(f)
#     for row in rd:
#         if i == 214:
#             print('')
#         # jrns.append(Journal(row))
#         s += '"' + str(row['ISSN']) + '":' + str(row).replace("'",'"').replace('samostatné ?asopisy','samostatné časopisy')
#         if i != 239:
#             s += ','
#
#         i+=1
#
# print(rd)
# s += '}}'
#
# print(s)
# #f = open('predatori.js','w',encoding='utf-8')
# #f.write(s)
# #f.close()
