#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import pathlib
import json
from test.support import EnvironmentVarGuard

sys.path[0:0] = [str(pathlib.Path(__file__).parent.resolve() / '..' / 'app')]

from tornado.testing import AsyncHTTPTestCase, gen_test

from main import TornadoApp
from foremanenvparser import ForemanEnvParser


class TornadoAppTest(AsyncHTTPTestCase):
    def get_app(self):
        with EnvironmentVarGuard() as env:
            config = ForemanEnvParser('.env')
            for env_var, value in config.env:
                env.set(env_var.upper(), value)
            return TornadoApp(os.environ['TORNADO_ENV'])

    @gen_test
    def test_candidates_card(self):
        for i in range(5):
            response = yield self.http_client.fetch(
                self.get_url(self._app.add_api_v('/candidates/Warlock/card')))
            res_data = json.loads(str(response.body, encoding='utf-8'))
            rarity = set([x['rarity'] for x in res_data['candidates']])
            klass = set([x['class'] for x in res_data['candidates']])
            serialize_data = [json.dumps(x) for x in res_data['candidates']]

            self.assertEqual(len(set(serialize_data)), 3)
            self.assertTrue(len(klass) < 3)
            self.assertTrue(len(rarity) < 3)

    @gen_test
    def test_candidates_hero(self):
        for i in range(5):
            response = yield self.http_client.fetch(self.get_url(
                self._app.add_api_v('/candidates/hero')))
            res_data = json.loads(str(response.body, encoding='utf-8'))
            serialize_data = [json.dumps(x) for x in res_data['candidates']]
            self.assertEqual(len(set(serialize_data)), 3)
