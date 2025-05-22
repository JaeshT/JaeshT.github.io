from typing import List, Union, Optional # Added Optional
from core.cards import Card, Rank # Added Rank

class Player:
    def __init__(self, player_id: Union[str, int]):
        self.player_id: Union[str, int] = player_id
        self.hand: List[Card] = []

    def __str__(self) -> str:
        return f"Player {self.player_id}"

    def __repr__(self) -> str:
        return f"Player(id='{self.player_id}')"

    def add_card_to_hand(self, card: Card):
        if not isinstance(card, Card):
            raise TypeError("Only Card objects can be added to hand.")
        self.hand.append(card)

    def show_hand(self) -> List[Card]:
        """Returns the list of cards in the player's hand."""
        return self.hand

    def show_hand_str(self) -> str:
        """Returns a string representation of the player's hand."""
        if not self.hand:
            return "Hand is empty"
        return ", ".join(str(card) for card in self.hand)

    def get_bid_action(self, current_highest_bid: int, min_next_bid: int) -> Optional[int]:
        """
        Determines the player's bidding action based on a simple AI logic.

        Args:
            current_highest_bid: The current highest bid made by an opponent in this
                                 bidding segment (0 if this player is to make the
                                 first bid in the segment).
            min_next_bid: The minimum valid bid value this player can make.

        Returns:
            The integer value of their bid if they choose to bid, or None if they
            choose to pass.
        """
        has_jack = False
        for card_in_hand in self.hand:
            if card_in_hand.rank == Rank.JACK:
                has_jack = True
                break

        # Simple AI: Only bid if holding at least one Jack and bid is < 30.
        # This AI does not consider the actual value of the hand beyond having a Jack.
        ai_bid_limit = 30

        if has_jack:
            if current_highest_bid == 0: # Player is starting this bidding interaction
                # If min_next_bid is too high for an opening bid for this AI, pass.
                if min_next_bid < ai_bid_limit:
                    return min_next_bid
                else:
                    return None # Pass (min_next_bid is too high to open with)
            else: # Player is responding to a bid
                # If min_next_bid is too high for this AI to continue, pass.
                if min_next_bid < ai_bid_limit:
                    return min_next_bid
                else:
                    return None # Pass (min_next_bid is too high to continue)
        else:
            # No Jacks, so pass immediately.
            return None # Pass
