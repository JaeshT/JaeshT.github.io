import pytest
from core.game_rules import calculate_game_value, GameType, SUIT_BASE_VALUES
from core.cards import Suit

# Tests for SUIT Games
def test_calculate_suit_game_values():
    """Tests calculation for SUIT games with various matador counts."""
    matador_counts = [1, 2, 4]
    for suit_enum_member in Suit: # Iterates through CLUBS, SPADES, HEARTS, DIAMONDS
        base_value = SUIT_BASE_VALUES[suit_enum_member]
        for matadors in matador_counts:
            expected_value = base_value * (matadors + 1)
            assert calculate_game_value(GameType.SUIT, num_matadors=matadors, suit_for_game=suit_enum_member) == expected_value, \
                f"Failed for {suit_enum_member.name} with {matadors} matadors."

    # Example of specific checks (already covered by loop, but good for illustration)
    assert calculate_game_value(GameType.SUIT, num_matadors=1, suit_for_game=Suit.CLUBS) == SUIT_BASE_VALUES[Suit.CLUBS] * (1 + 1)
    assert calculate_game_value(GameType.SUIT, num_matadors=2, suit_for_game=Suit.SPADES) == SUIT_BASE_VALUES[Suit.SPADES] * (2 + 1)
    assert calculate_game_value(GameType.SUIT, num_matadors=4, suit_for_game=Suit.HEARTS) == SUIT_BASE_VALUES[Suit.HEARTS] * (4 + 1)
    assert calculate_game_value(GameType.SUIT, num_matadors=3, suit_for_game=Suit.DIAMONDS) == SUIT_BASE_VALUES[Suit.DIAMONDS] * (3 + 1) # Test with 3 too

# Tests for GRAND Games
def test_calculate_grand_game_values():
    """Tests calculation for GRAND games with various matador counts."""
    grand_base_value = 24
    matador_counts = [1, 2, 4, 3] # Test with various counts
    for matadors in matador_counts:
        expected_value = grand_base_value * (matadors + 1)
        assert calculate_game_value(GameType.GRAND, num_matadors=matadors) == expected_value, \
            f"Failed for GRAND with {matadors} matadors."
    
    # Specific examples
    assert calculate_game_value(GameType.GRAND, num_matadors=1) == 24 * (1 + 1)
    assert calculate_game_value(GameType.GRAND, num_matadors=4) == 24 * (4 + 1)

# Tests for NULL Games
def test_calculate_null_game_values():
    """Tests calculation for NULL games. Matadors should be ignored."""
    null_fixed_value = 23
    # Matador count is required by function signature but ignored for NULL
    assert calculate_game_value(GameType.NULL, num_matadors=1) == null_fixed_value
    assert calculate_game_value(GameType.NULL, num_matadors=4) == null_fixed_value
    assert calculate_game_value(GameType.NULL, num_matadors=1, suit_for_game=Suit.CLUBS) == null_fixed_value, \
        "Suit argument should be ignored for NULL games."

# Tests for Validation Logic
def test_calculate_game_value_validation_errors():
    """Tests that calculate_game_value raises appropriate ValueErrors."""
    # Test SUIT game without suit_for_game
    with pytest.raises(ValueError, match="suit_for_game must be provided for a SUIT game."):
        calculate_game_value(GameType.SUIT, num_matadors=1)

    # Test num_matadors < 1
    with pytest.raises(ValueError, match="Number of matadors .* must be 1 or greater."):
        calculate_game_value(GameType.SUIT, num_matadors=0, suit_for_game=Suit.CLUBS)
    
    with pytest.raises(ValueError, match="Number of matadors .* must be 1 or greater."):
        calculate_game_value(GameType.GRAND, num_matadors=0)

    with pytest.raises(ValueError, match="Number of matadors .* must be 1 or greater."):
        calculate_game_value(GameType.NULL, num_matadors=0)

    with pytest.raises(ValueError, match="Number of matadors .* must be 1 or greater."):
        calculate_game_value(GameType.SUIT, num_matadors=-1, suit_for_game=Suit.CLUBS)

    # Test TypeError for invalid enum types (optional, but good for robustness)
    with pytest.raises(TypeError, match="game_type must be an instance of GameType enum."):
        calculate_game_value("NOT_A_GAMETYPE", num_matadors=1, suit_for_game=Suit.CLUBS) # type: ignore

    with pytest.raises(TypeError, match="suit_for_game must be an instance of Suit enum for a SUIT game."):
        calculate_game_value(GameType.SUIT, num_matadors=1, suit_for_game="NOT_A_SUIT") # type: ignore

    with pytest.raises(TypeError, match="num_matadors must be an integer."):
        calculate_game_value(GameType.GRAND, num_matadors=1.5) # type: ignore
