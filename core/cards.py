from enum import Enum
from typing import List
import random # Added import random

class Suit(Enum):
    CLUBS = "Clubs"
    SPADES = "Spades"
    HEARTS = "Hearts"
    DIAMONDS = "Diamonds"

class Rank(Enum):
    ACE = "Ace"
    KING = "King"
    QUEEN = "Queen"
    JACK = "Jack"
    TEN = "10"
    NINE = "9"
    EIGHT = "8"
    SEVEN = "7"

class Card:
    def __init__(self, rank: Rank, suit: Suit):
        if not isinstance(rank, Rank):
            raise TypeError("rank must be an instance of Rank")
        if not isinstance(suit, Suit):
            raise TypeError("suit must be an instance of Suit")
        self.rank = rank
        self.suit = suit

    def __str__(self) -> str:
        return f"{self.rank.value} of {self.suit.value}"

    def __repr__(self) -> str:
        return f"Card(Rank.{self.rank.name}, Suit.{self.suit.name})"

    def __eq__(self, other) -> bool:
        if not isinstance(other, Card):
            return NotImplemented
        return self.rank == other.rank and self.suit == other.suit

    def __hash__(self) -> int:
        return hash((self.rank, self.suit))

def create_deck() -> List[Card]:
    """
    Creates a standard 32-card Skat deck.

    The deck is created in a consistent order:
    Clubs (Ace, King, Queen, Jack, 10, 9, 8, 7),
    Spades (Ace, King, Queen, Jack, 10, 9, 8, 7),
    Hearts (Ace, King, Queen, Jack, 10, 9, 8, 7),
    Diamonds (Ace, King, Queen, Jack, 10, 9, 8, 7).

    Returns:
        A list of 32 unique Card objects.
    """
    deck = []
    for suit in Suit:
        for rank in Rank:
            deck.append(Card(rank, suit))
    return deck

def shuffle_deck(deck: List[Card]) -> List[Card]:
    """
    Shuffles a list of Card objects in place.

    Args:
        deck: A list of Card objects.

    Returns:
        The shuffled list of Card objects.
    """
    random.shuffle(deck)
    return deck
