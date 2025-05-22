import pytest
import random
from typing import List, Set
from core.cards import Card, Rank, Suit, create_deck, shuffle_deck
from core.player import Player
from core.game_logic import deal_cards

# --- Tests for shuffle_deck (from core.cards) ---

def test_shuffle_deck_changes_order_and_content():
    """
    Tests that shuffle_deck changes the order of cards but not the content.
    There's a small chance (1/32!) that the order remains identical.
    A more robust check is that the sets of cards are the same.
    """
    original_deck = create_deck()
    deck_to_shuffle = list(original_deck) # Make a mutable copy

    shuffled_deck = shuffle_deck(deck_to_shuffle)

    # Check that the list object itself was modified (shuffle is in-place)
    assert deck_to_shuffle is shuffled_deck

    # Check that lengths are the same
    assert len(shuffled_deck) == 32
    assert len(original_deck) == 32

    # Check that the content is the same (all cards are present)
    assert set(shuffled_deck) == set(original_deck)

    # Check if order has changed. This might fail in extremely rare cases (1/32!).
    # If this test is flaky, consider running multiple times or using a statistical approach.
    # For now, a simple inequality check is usually sufficient.
    if len(original_deck) > 1 : # Avoid issues with 0 or 1 card decks for order check
      assert shuffled_deck != original_deck, "Shuffled deck order is the same as original (rare, but possible)."


def test_shuffle_deck_small_list():
    """
    Tests shuffling with a small, manually defined list of cards.
    """
    card1 = Card(Rank.ACE, Suit.SPADES)
    card2 = Card(Rank.KING, Suit.HEARTS)
    card3 = Card(Rank.QUEEN, Suit.CLUBS)
    small_deck_original = [card1, card2, card3]
    small_deck_to_shuffle = list(small_deck_original)

    shuffled_small_deck = shuffle_deck(small_deck_to_shuffle)

    assert small_deck_to_shuffle is shuffled_small_deck
    assert len(shuffled_small_deck) == 3
    assert set(shuffled_small_deck) == set(small_deck_original)
    # Again, checking for order change is probabilistic for small lists.
    # If all elements are unique, set equality is a good indicator.
    if len(set(small_deck_original)) == len(small_deck_original) and len(small_deck_original) > 1:
        assert shuffled_small_deck != small_deck_original, "Shuffled small deck order is the same (possible for small N)."

def test_shuffle_empty_and_single_card_deck():
    """Tests shuffling an empty deck and a deck with a single card."""
    empty_deck_original: List[Card] = []
    empty_deck_to_shuffle = list(empty_deck_original)
    shuffled_empty_deck = shuffle_deck(empty_deck_to_shuffle)
    assert len(shuffled_empty_deck) == 0
    assert shuffled_empty_deck == empty_deck_original

    single_card_deck_original = [Card(Rank.ACE, Suit.CLUBS)]
    single_card_deck_to_shuffle = list(single_card_deck_original)
    shuffled_single_card_deck = shuffle_deck(single_card_deck_to_shuffle)
    assert len(shuffled_single_card_deck) == 1
    assert shuffled_single_card_deck == single_card_deck_original


# --- Pytest Fixture for deal_cards tests ---

@pytest.fixture
def game_setup():
    """Provides a standard shuffled deck and a list of three player objects."""
    deck = create_deck()
    shuffled_deck = shuffle_deck(list(deck)) # Ensure it's a copy that's shuffled
    players = [Player("P1"), Player("P2"), Player("P3")]
    return {"deck": deck, "shuffled_deck": shuffled_deck, "players": players}


# --- Tests for deal_cards (from core.game_logic) ---

def test_deal_cards_distribution(game_setup):
    """Tests that cards are distributed correctly: 10 to each player, 2 to Skat."""
    shuffled_deck = game_setup["shuffled_deck"]
    players = game_setup["players"]

    skat = deal_cards(shuffled_deck, players)

    for player in players:
        assert len(player.hand) == 10
    assert len(skat) == 2

def test_deal_cards_all_cards_accounted_for(game_setup):
    """Tests that all 32 cards are distributed and accounted for."""
    original_deck_unshuffled = game_setup["deck"] # The pristine, ordered deck
    shuffled_deck = game_setup["shuffled_deck"]
    players = game_setup["players"]

    skat = deal_cards(shuffled_deck, players)

    all_dealt_cards: List[Card] = []
    for player in players:
        all_dealt_cards.extend(player.hand)
    all_dealt_cards.extend(skat)

    assert len(all_dealt_cards) == 32
    assert set(all_dealt_cards) == set(original_deck_unshuffled), \
        "The set of dealt cards must be identical to the original deck."

def test_deal_cards_clears_hands_before_dealing(game_setup):
    """
    Tests that deal_cards clears players' hands before dealing new cards.
    This relies on the implementation of deal_cards which includes hand.clear().
    """
    shuffled_deck = game_setup["shuffled_deck"]
    players = game_setup["players"]

    # Give a player a card before dealing
    players[0].add_card_to_hand(Card(Rank.ACE, Suit.DIAMONDS)) # A card not necessarily in the deck
    assert len(players[0].hand) == 1

    skat = deal_cards(shuffled_deck, players)

    # Hand should now have 10 cards from the current deal, not 11
    assert len(players[0].hand) == 10
    for player in players:
        assert len(player.hand) == 10
    assert len(skat) == 2

def test_deal_cards_error_invalid_deck_size(game_setup):
    """Tests ValueError for incorrect deck size."""
    players = game_setup["players"]
    full_shuffled_deck = game_setup["shuffled_deck"]

    deck_too_small = full_shuffled_deck[:31]
    with pytest.raises(ValueError, match="Deck must contain exactly 32 cards"):
        deal_cards(deck_too_small, players)

    deck_too_large = full_shuffled_deck + [Card(Rank.ACE, Suit.CLUBS)]
    with pytest.raises(ValueError, match="Deck must contain exactly 32 cards"):
        deal_cards(deck_too_large, players)

def test_deal_cards_error_invalid_player_count(game_setup):
    """Tests ValueError for incorrect number of players."""
    shuffled_deck = game_setup["shuffled_deck"]
    all_players = game_setup["players"]

    two_players = all_players[:2]
    with pytest.raises(ValueError, match="Skat requires exactly 3 players"):
        deal_cards(shuffled_deck, two_players)

    four_players = all_players + [Player("P4")]
    with pytest.raises(ValueError, match="Skat requires exactly 3 players"):
        deal_cards(shuffled_deck, four_players)

def test_deal_cards_deck_uniqueness_after_dealing(game_setup):
    """
    Ensures that after dealing, all cards (in hands and skat) are unique
    and form the complete original deck.
    """
    original_deck_unshuffled_set = set(game_setup["deck"])
    shuffled_deck = game_setup["shuffled_deck"]
    players = game_setup["players"]

    skat = deal_cards(shuffled_deck, players)

    all_cards_dealt: List[Card] = []
    for p in players:
        all_cards_dealt.extend(p.hand)
    all_cards_dealt.extend(skat)

    assert len(all_cards_dealt) == 32
    assert len(set(all_cards_dealt)) == 32, "Dealt cards should all be unique."
    assert set(all_cards_dealt) == original_deck_unshuffled_set

def test_deal_cards_uses_input_deck_instance(game_setup):
    """
    Tests that the deal_cards function actually uses the cards from the
    shuffled_deck instance it is passed, not by recreating its own.
    """
    shuffled_deck_instance = game_setup["shuffled_deck"]
    players = game_setup["players"]

    # Take a snapshot of the top few cards of the specific shuffled deck instance
    # before dealing.
    # The dealing logic pops from the start of a copy of this deck.
    expected_first_card_for_player1 = shuffled_deck_instance[0]
    expected_second_card_for_player1 = shuffled_deck_instance[1]
    expected_third_card_for_player1 = shuffled_deck_instance[2]

    # Expected Skat cards if dealing is 3,3,3 then 2 to skat, then 4,4,4 then 3,3,3
    # P1: 0,1,2 | P2: 3,4,5 | P3: 6,7,8
    # Skat: 9, 10
    expected_skat_card1 = shuffled_deck_instance[9]
    expected_skat_card2 = shuffled_deck_instance[10]


    skat = deal_cards(shuffled_deck_instance, players)

    # Check specific cards based on the dealing order (3,S,4,3)
    # Player 1's first three cards
    assert players[0].hand[0] == expected_first_card_for_player1
    assert players[0].hand[1] == expected_second_card_for_player1
    assert players[0].hand[2] == expected_third_card_for_player1

    # Check Skat cards
    assert skat[0] == expected_skat_card1
    assert skat[1] == expected_skat_card2

    # Check Player 1's next 4 cards
    # P1: 0,1,2 -- P2: 3,4,5 -- P3: 6,7,8 -- Skat: 9,10
    # P1: 11,12,13,14 -- P2: 15,16,17,18 -- P3: 19,20,21,22
    assert players[0].hand[3] == shuffled_deck_instance[11]
    assert players[0].hand[4] == shuffled_deck_instance[12]
    assert players[0].hand[5] == shuffled_deck_instance[13]
    assert players[0].hand[6] == shuffled_deck_instance[14]

    # Check Player 1's final 3 cards
    # P1: 0,1,2 -- P2: 3,4,5 -- P3: 6,7,8 -- Skat: 9,10
    # P1: 11,12,13,14 -- P2: 15,16,17,18 -- P3: 19,20,21,22
    # P1: 23,24,25 -- P2: 26,27,28 -- P3: 29,30,31
    assert players[0].hand[7] == shuffled_deck_instance[23]
    assert players[0].hand[8] == shuffled_deck_instance[24]
    assert players[0].hand[9] == shuffled_deck_instance[25]

    # Similarly, we can check for other players too, e.g. Player 3's last card
    assert players[2].hand[9] == shuffled_deck_instance[31]

    # Verify all cards in hands and skat come from the original shuffled_deck_instance
    all_dealt_cards_set = set()
    for p in players:
      all_dealt_cards_set.update(p.hand)
    all_dealt_cards_set.update(skat)
    assert all_dealt_cards_set == set(shuffled_deck_instance)
