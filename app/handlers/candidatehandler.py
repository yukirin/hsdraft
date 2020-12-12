#!/usr/bin/env python
# -*- coding: utf-8 -*-

import random

from tornado import gen
from tornado.web import HTTPError
from .basehandler import HSDraftBaseHandler


class CandidateHandler(HSDraftBaseHandler):
    def initialize(self):
        self.candidates = []

    @gen.coroutine
    def get(self):
        for i in range(3):
            self.candidates.append((yield self.get_candidate()))
        self.render({'candidates': self.candidates})

    @gen.coroutine
    def get_candidate(self):
        params = self._build_params()
        if not params['$and']: del params['$and']
        candidate = yield self.settings['db'][self.col].find_one(params, self.projection)
        if not candidate:
            raise HTTPError(404)
        return candidate

    def _build_params(self):
        return {
            '$and': [{'name': {'$ne': x['name']}} for x in self.candidates],
            'pick': {'$near': [random.random(), 0]}
        }


class CandidatesHeroHandler(CandidateHandler):
    col = 'heroes'
    projection = {
        '_id': 0, 'name': 1, 'iconimage': 1, 'cardimage': 1,
    }


class CandidateCardHandler(CandidateHandler):
    col = 'cardlist'

    def prepare(self):
        self.rarity = self._get_rarity()

    @gen.coroutine
    def get(self, name):
        self.hero_name = name
        yield super().get()

    def _build_params(self):
        params = super()._build_params()
        params['$and'].append({'$or': [{'class': 'Any'}, {'class': self.hero_name}]})
        params['$and'].append({'$or': [{'Rarity': r} for r in self.rarity]})
        return params

    def _get_rarity(self):
        x = random.random()
        if x < 0.69: return ['Common', 'Free']
        if x < 0.94: return ['Rare']
        if x < 0.987: return ['Epic']
        return ['Legendary']
