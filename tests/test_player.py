import pytest
from typing import List
from core.player import Player
from core.cards import Card, Rank, Suit # Added Suit for creating diverse cards

# Helper function to create a sample hand
def create_sample_hand(player_id: str, has_jacks: bool) -> Player:
    """
    Creates a Player with a sample hand.
    Hand will contain a Jack if has_jacks is True.
    """
    player = Player(player_id)
    if has_jacks:
        player.add_card_to_hand(Card(Rank.JACK, Suit.CLUBS))
        player.add_card_to_hand(Card(Rank.ACE, Suit.HEARTS))
        player.add_card_to_hand(Card(Rank.TEN, Suit.DIAMONDS))
    else:
        player.add_card_to_hand(Card(Rank.ACE, Suit.SPADES))
        player.add_card_to_hand(Card(Rank.KING, Suit.HEARTS))
        player.add_card_to_hand(Card(Rank.QUEEN, Suit.DIAMONDS))
    return player

# --- Tests for Player.get_bid_action ---

# Test Bidding with Jacks
def test_get_bid_action_with_jacks_starts_bidding():
    """Player has Jacks. current_highest_bid = 0, min_next_bid = 18. Expected: returns 18."""
    player = create_sample_hand("P1_jacks", has_jacks=True)
    action = player.get_bid_action(current_highest_bid=0, min_next_bid=18)
    assert action == 18, "Player with Jacks should open bid at 18."

def test_get_bid_action_with_jacks_continues_bidding():
    """Player has Jacks. current_highest_bid = 20, min_next_bid = 22. Expected: returns 22."""
    player = create_sample_hand("P2_jacks", has_jacks=True)
    action = player.get_bid_action(current_highest_bid=20, min_next_bid=22)
    assert action == 22, "Player with Jacks should continue bidding to 22."

def test_get_bid_action_with_jacks_passes_at_ai_limit():
    """Player has Jacks. current_highest_bid = 28, min_next_bid = 30. Expected: returns None (passes)."""
    player = create_sample_hand("P3_jacks", has_jacks=True)
    # AI limit is < 30, so bidding 30 should result in a pass.
    action = player.get_bid_action(current_highest_bid=28, min_next_bid=30)
    assert action is None, "Player with Jacks should pass if next bid meets/exceeds AI limit of 30."

    # Also test if min_next_bid is even higher
    action_higher = player.get_bid_action(current_highest_bid=28, min_next_bid=33)
    assert action_higher is None, "Player with Jacks should pass if next bid well exceeds AI limit."


# Test Bidding without Jacks
def test_get_bid_action_without_jacks_passes_when_starting():
    """Player has no Jacks. current_highest_bid = 0, min_next_bid = 18. Expected: returns None."""
    player = create_sample_hand("P4_no_jacks", has_jacks=False)
    action = player.get_bid_action(current_highest_bid=0, min_next_bid=18)
    assert action is None, "Player without Jacks should pass when starting."

def test_get_bid_action_without_jacks_passes_when_continuing():
    """Player has no Jacks. current_highest_bid = 20, min_next_bid = 22. Expected: returns None."""
    player = create_sample_hand("P5_no_jacks", has_jacks=False)
    action = player.get_bid_action(current_highest_bid=20, min_next_bid=22)
    assert action is None, "Player without Jacks should pass when continuing."

# Test min_next_bid influence when starting with Jacks
def test_get_bid_action_with_jacks_passes_if_min_bid_too_high_to_start():
    """Player has Jacks. current_highest_bid = 0, min_next_bid = 33. Expected: returns None."""
    player = create_sample_hand("P6_jacks", has_jacks=True)
    # AI limit is < 30. If min_next_bid to open is already 33, AI should pass.
    action = player.get_bid_action(current_highest_bid=0, min_next_bid=33)
    assert action is None, "Player with Jacks should pass if min_next_bid to open is above AI limit."

def test_get_bid_action_with_jacks_bids_just_below_limit():
    """Player has Jacks. current_highest_bid = 0, min_next_bid = 29. Expected: returns 29."""
    player = create_sample_hand("P7_jacks", has_jacks=True)
    action = player.get_bid_action(current_highest_bid=0, min_next_bid=29)
    assert action == 29, "Player with Jacks should bid 29 if it's below AI limit."

    action_continue = player.get_bid_action(current_highest_bid=27, min_next_bid=29)
    assert action_continue == 29, "Player with Jacks should continue bid to 29 if it's below AI limit."

# Test that player_id is correctly assigned and accessible (basic Player test)
def test_player_creation_and_id():
    player = Player(player_id="test_player_123")
    assert player.player_id == "test_player_123"
    assert str(player) == "Player test_player_123"
    assert repr(player) == "Player(id='test_player_123')"

# Test hand manipulation (basic Player test)
def test_player_hand_manipulation():
    player = Player("hand_test_player")
    assert player.show_hand() == []
    card1 = Card(Rank.ACE, Suit.SPADES)
    card2 = Card(Rank.KING, Suit.HEARTS)
    player.add_card_to_hand(card1)
    assert player.show_hand() == [card1]
    player.add_card_to_hand(card2)
    assert player.show_hand() == [card1, card2]
    assert player.show_hand_str() == "Ace of Spades, King of Hearts"
    player.hand.clear()
    assert player.show_hand() == []
    assert player.show_hand_str() == "Hand is empty"
