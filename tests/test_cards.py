import pytest
from core.cards import Suit, Rank, Card, create_deck

# Tests for Suit Enum
def test_suit_values():
    assert len(Suit) == 4
    expected_suits = {"Clubs", "Spades", "Hearts", "Diamonds"}
    assert {s.value for s in Suit} == expected_suits
    assert Suit.CLUBS.value == "Clubs"
    assert Suit.SPADES.value == "Spades"
    assert Suit.HEARTS.value == "Hearts"
    assert Suit.DIAMONDS.value == "Diamonds"

# Tests for Rank Enum
def test_rank_values():
    assert len(Rank) == 8
    expected_ranks = {"Ace", "King", "Queen", "Jack", "10", "9", "8", "7"}
    assert {r.value for r in Rank} == expected_ranks
    assert Rank.ACE.value == "Ace"
    assert Rank.KING.value == "King"
    assert Rank.QUEEN.value == "Queen"
    assert Rank.JACK.value == "Jack"
    assert Rank.TEN.value == "10"
    assert Rank.NINE.value == "9"
    assert Rank.EIGHT.value == "8"
    assert Rank.SEVEN.value == "7"

# Tests for Card Class
def test_card_creation():
    ace_of_spades = Card(Rank.ACE, Suit.SPADES)
    assert ace_of_spades.rank == Rank.ACE
    assert ace_of_spades.suit == Suit.SPADES

    king_of_hearts = Card(Rank.KING, Suit.HEARTS)
    assert king_of_hearts.rank == Rank.KING
    assert king_of_hearts.suit == Suit.HEARTS

def test_card_creation_type_errors():
    with pytest.raises(TypeError, match="rank must be an instance of Rank"):
        Card("NotARank", Suit.CLUBS)
    with pytest.raises(TypeError, match="suit must be an instance of Suit"):
        Card(Rank.ACE, "NotASuit")

def test_card_str_representation():
    ace_of_spades = Card(Rank.ACE, Suit.SPADES)
    assert str(ace_of_spades) == "Ace of Spades"

    jack_of_clubs = Card(Rank.JACK, Suit.CLUBS)
    assert str(jack_of_clubs) == "Jack of Clubs"

    seven_of_diamonds = Card(Rank.SEVEN, Suit.DIAMONDS)
    assert str(seven_of_diamonds) == "7 of Diamonds"

def test_card_repr_representation():
    ace_of_spades = Card(Rank.ACE, Suit.SPADES)
    assert repr(ace_of_spades) == "Card(Rank.ACE, Suit.SPADES)"

    queen_of_hearts = Card(Rank.QUEEN, Suit.HEARTS)
    assert repr(queen_of_hearts) == "Card(Rank.QUEEN, Suit.HEARTS)"

def test_card_equality():
    card1 = Card(Rank.ACE, Suit.SPADES)
    card2 = Card(Rank.ACE, Suit.SPADES)
    card3 = Card(Rank.KING, Suit.SPADES)
    card4 = Card(Rank.ACE, Suit.HEARTS)

    assert card1 == card2
    assert card1 != card3
    assert card1 != card4
    assert card3 != card4
    assert (card1 == "Ace of Spades") is False # Check against different type

def test_card_hashable():
    card1 = Card(Rank.ACE, Suit.SPADES)
    card2 = Card(Rank.KING, Suit.HEARTS)
    card_set = {card1, card2}
    assert len(card_set) == 2
    assert card1 in card_set
    assert card2 in card_set

    # Adding the same card again should not change the set size
    card_set.add(Card(Rank.ACE, Suit.SPADES))
    assert len(card_set) == 2

# Tests for create_deck function
def test_create_deck_size():
    deck = create_deck()
    assert len(deck) == 32

def test_create_deck_uniqueness():
    deck = create_deck()
    assert len(set(deck)) == 32, "Deck should contain 32 unique cards"

def test_create_deck_specific_card():
    deck = create_deck()
    ace_of_spades = Card(Rank.ACE, Suit.SPADES)
    king_of_hearts = Card(Rank.KING, Suit.HEARTS)
    seven_of_diamonds = Card(Rank.SEVEN, Suit.DIAMONDS)

    assert ace_of_spades in deck
    assert king_of_hearts in deck
    assert seven_of_diamonds in deck
    assert Card(Rank.ACE, Suit.CLUBS) in deck # First card
    assert Card(Rank.SEVEN, Suit.DIAMONDS) in deck # Last card

def test_create_deck_order():
    deck = create_deck()
    # Expected order: Clubs (A-7), Spades (A-7), Hearts (A-7), Diamonds (A-7)
    idx = 0
    for suit in Suit: # Suit enum is defined in Clubs, Spades, Hearts, Diamonds order
        for rank in Rank: # Rank enum is defined in Ace, King, ..., 7 order
            assert deck[idx].suit == suit
            assert deck[idx].rank == rank
            idx += 1
    assert idx == 32 # Ensure all cards were checked
