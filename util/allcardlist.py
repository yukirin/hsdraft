#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup


def card2dict(card_info, expansion):
    def get_card_name(tag):
        return tag.a.string

    def get_card_rarity(tag):
        return tag.find_all("span")[1].string

    def get_card_type(tag):
        try:
            return next(tag.stripped_strings)
        except StopIteration:
            return ""

    def get_card_class(tag):
        return tag['class'][0].replace("-box", "").capitalize()

    def get_card_cost(tag): return get_card_type(tag)

    def get_card_atk(tag): return get_card_type(tag)

    def get_card_hp(tag): return get_card_type(tag)

    def get_card_subtype(tag): return get_card_type(tag)

    get_funcs = [
        get_card_name, get_card_rarity, get_card_type, get_card_subtype,
        get_card_class, get_card_cost, get_card_atk, get_card_hp
    ]

    card_data = {"expansion": expansion}
    for tag, f in zip(card_info[1:], get_funcs):
        card_data[f.__name__.replace("get_card_", "")] = f(tag)

    return card_data


def all_card_list():
    card_lists = [
        "Basic_card_list", "Classic_card_list", "Goblins_vs_Gnomes_card_list",
        "Naxxramas_card_list", "Reward_card_list", "Promo_card_list"
    ]

    for card_list in card_lists:
        with open("./" + card_list) as f:
            soup = BeautifulSoup(f.read())

        for card in soup.find(
                class_="cardtable-collapsible").find_all(
                    "tr", lambda css_class: css_class != "narrowonly")[1:]:
            yield card2dict(card.find_all("td"), card_list.replace("_card_list", ""))
