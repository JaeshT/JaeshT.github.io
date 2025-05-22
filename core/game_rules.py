from enum import Enum
from typing import Optional, List # Added List
from core.cards import Suit

class GameType(Enum):
    """
    Represents the different types of games that can be played in Skat.
    """
    SUIT = "Suit Game"    # A game where a specific suit is trump
    GRAND = "Grand"       # A game where only Jacks are trumps
    NULL = "Null"         # A game where the declarer tries to take no tricks

# Base values for suit games. The higher the value, the more valuable the suit.
SUIT_BASE_VALUES = {
    Suit.CLUBS: 12,
    Suit.SPADES: 11,
    Suit.HEARTS: 10,
    Suit.DIAMONDS: 9
}

# Standard Skat Bid Values. This list represents the sequence of possible bids.
# A player must bid a value from this list, or pass.
# This list can be extended for higher game values.
SKAT_BID_VALUES: List[int] = [
    18, 20, 22, 23, 24, 27, 30, 33, 35, 36, 40, 44, 45, 46, 48, 50,
    54, 55, 59, 60, 63, 66, 70, 72, 77, 80, 81, 84, 88, 90, 96, 99,
    100, 108, 110, 117, 120, 121, 126, 130, 132, 135, 140, 143, 144,
    150, 153, 154, 156, 160, 162, 165, 168, 170, 176, 180, 187, 192,
    198, 204, 216, 240, 264 # Examples of higher values
]


# Matadors (Spitzen):
# Matadors are determined by the uninterrupted sequence of Jacks from the Jack of Clubs downwards
# (J♣, J♠, J♥, J♦).
# - If the player (or their team, in partnership games) holds the Jack of Clubs,
#   they are playing "With Matadors". The number of Matadors is the count of
#   Jacks they hold in sequence starting from J♣.
#   Example: Holds J♣, J♠, but not J♥ -> "With 2 Matadors".
#
# - If the player (or their team) does *not* hold the Jack of Clubs,
#   they are playing "Without Matadors". The number of Matadors is the count of
#   Jacks *missing* in sequence starting from J♣.
#   Example: Missing J♣, but the opponents hold it. Player does not hold J♠. -> "Without 2 Matadors" (missing J♣, J♠).
#
# The number of Matadors (either "With X" or "Without X") is a multiplier in
# the game value calculation for Suit and Grand games. It does not apply to Null games.
# For example:
#   - With J♣, J♠, J♥, J♦: "With 4"
#   - With J♣ only: "With 1"
#   - Without J♣, but with J♠, J♥, J♦: "Without 1"
#   - Without J♣, J♠, J♥, J♦ (i.e., opponents have all Jacks): "Without 4"
#
# We are not implementing the logic to *count* matadors yet, just defining
# what they are conceptually for now. The calculation involves knowing which
# player has which Jacks.

def calculate_game_value(
    game_type: GameType,
    num_matadors: int, # Represents the actual count of sequential Jacks (e.g., 1 for "With 1" or "Without 1")
    suit_for_game: Optional[Suit] = None
) -> int:
    """
    Calculates the basic game value for Skat based on game type, matadors, and suit.

    Args:
        game_type: The type of game being played (SUIT, GRAND, NULL).
        num_matadors: The number of Matadors (sequential Jacks held or missing,
                      e.g., 1 for "With 1 Jack" or "Without 1 Jack"). Must be >= 1.
                      This number, plus 1 (for "game"), forms the multiplier.
        suit_for_game: The trump suit, required only if game_type is SUIT.

    Returns:
        The calculated game value.

    Raises:
        ValueError: If inputs are invalid (e.g., num_matadors < 1, or
                    suit_for_game not provided for a SUIT game).
    """
    if not isinstance(game_type, GameType):
        raise TypeError("game_type must be an instance of GameType enum.")
    if not isinstance(num_matadors, int):
        raise TypeError("num_matadors must be an integer.")
    if num_matadors < 1:
        raise ValueError("Number of matadors (num_matadors) must be 1 or greater.")

    if game_type == GameType.SUIT:
        if suit_for_game is None:
            raise ValueError("suit_for_game must be provided for a SUIT game.")
        if not isinstance(suit_for_game, Suit):
            raise TypeError("suit_for_game must be an instance of Suit enum for a SUIT game.")

        base_value = SUIT_BASE_VALUES.get(suit_for_game)
        if base_value is None:
            # This should not happen if suit_for_game is a valid Suit enum member
            raise ValueError(f"Invalid suit '{suit_for_game}' provided for SUIT game.")
        
        # Multiplier = num_matadors + 1 (for "game" level)
        # More levels (Schneider, Schwarz, etc.) would increase the "+1" factor
        # or be added as additional multipliers.
        multiplier = num_matadors + 1
        return base_value * multiplier

    elif game_type == GameType.GRAND:
        # Base value for Grand is always 24
        base_value = 24
        multiplier = num_matadors + 1
        return base_value * multiplier

    elif game_type == GameType.NULL:
        # For Null games, matadors and suit are irrelevant.
        # We'll use a fixed value for a standard Null game.
        # Other Null variations (Null Hand, Null Ouvert, etc.) have different fixed values.
        return 23 # Standard Null game value

    else:
        # Should be unreachable if game_type is a valid GameType enum member
        raise ValueError(f"Unhandled game type: {game_type}")
