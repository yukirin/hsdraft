#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import pathlib
import json
from test.support import EnvironmentVarGuard

sys.path[0:0] = [str(pathlib.Path(__file__).parent.resolve() / '..' / 'app')]

from tornado.testing import AsyncHTTPTestCase, gen_test
from tornado.httpclient import HTTPError

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
    def test_card(self):
        response = yield self.http_client.fetch(
            self.get_url(self._app.add_api_v('/cards/Captain\'s Parrot')))
        data = {
            "rarity": "Epic", "name": "Captain's Parrot", "hp": 1,
            "expansion": "Reward", "subtype": "Beast", "atk": 1,
            "type": "Minion", "class": "Any", "cost": 2,
            "pick": [0.5386892612164794, 0], "artist": "Daren Bader",
            "id": "NEW1_016", "mechanics": ["Battlecry"],
            "text": "<b>Battlecry:</b> Put a random Pirate from your deck into your hand.",
            "cardimage": "/static/img/cards/559.png",
            "flavor": "Pirates and Parrots go together like Virmen and Carrots."
        }
        response_data = json.loads(str(response.body, encoding='utf-8'))
        self.assertEqual(response_data, data)

    @gen_test
    def test_404(self):
        with self.assertRaises(HTTPError) as cm:
            yield self.http_client.fetch(self.get_url(self._app.add_api_v('/cards/fugafuga')))
        self.assertEqual(cm.exception.code, 404)
