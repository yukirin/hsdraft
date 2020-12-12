#!/usr/bin/env python
# -*- coding: utf-8 -*-

from tornado import gen
from tornado.web import HTTPError
from .basehandler import HSDraftBaseHandler


class CardHandler(HSDraftBaseHandler):
    @gen.coroutine
    def get(self, name):
        card = yield self.get_card(self.decode_name(name))
        if not card:
            raise HTTPError(404)
        self.render(card)

    @gen.coroutine
    def get_card(self, name):
        card = yield self.settings['db'].cardlist.find_one({'name': name}, self.not_id)
        return card

    def decode_name(self, name):
        return name.replace("%27", "'").replace("_", " ")
