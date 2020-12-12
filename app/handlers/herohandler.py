#!/usr/bin/env python
# -*- coding: utf-8 -*-

from tornado import gen
from tornado.web import HTTPError
from .basehandler import HSDraftBaseHandler


class HeroHandler(HSDraftBaseHandler):
    @gen.coroutine
    def get(self, name):
        hero = yield self.get_hero(name)
        if not hero:
            raise HTTPError(404)
        self.render(hero)

    @gen.coroutine
    def get_hero(self, name):
        hero = yield self.settings['db'].heroes.find_one({'name': name}, self.not_id)
        return hero
