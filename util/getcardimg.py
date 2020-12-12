#!/usr/bin/env python
# -*- coding: utf-8 -*-


from pymongo import MongoClient


client = MongoClient('mongodb://localhost:27017/')
col = client.rin_stg.heroes

heroes = [hero for hero in col.find()]
print(heroes)

for hero in heroes:
    icon_image = '/static/img/heroes/hp' + str(int(hero['id'])) + '.png'
    # col.update({'name': hero['name']}, {'$set': {'iconimage': icon_image}})
