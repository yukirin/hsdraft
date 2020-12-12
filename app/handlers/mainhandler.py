#!/usr/bin/env python
# -*- coding: utf-8 -*-

from .basehandler import BaseHandler


class MainHandler(BaseHandler):
    def get(self):
        self.render('index.html')
