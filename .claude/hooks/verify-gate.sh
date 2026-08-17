#!/bin/bash
# Completion gate. Wired to the TaskCompleted hook in .claude/settings.json.
#
# Exit 0 -> the task is allowed to be marked done.
# Exit 2 -> completion is BLOCKED and everything on stderr goes back to the agent as feedback.
#
# The whole point of this file is that "done" stops being something an agent can simply
# assert. It has to survive `npm run verify` first. Costs no tokens, cannot be talked around.

cd "$CLAUDE_PROJECT_DIR" || exit 0

# No verifier means nothing to enforce. Stay out of the way rather than blocking everything.
[ -f scripts/verify.mjs ] || exit 0

output=$(node scripts/verify.mjs 2>&1)
status=$?

if [ $status -ne 0 ]; then
  {
    echo "BLOCKED: this task cannot be marked complete because verification failed."
    echo ""
    echo "$output"
    echo ""
    echo "Fix the failures above and run 'npm run verify' until it passes."
    echo "Do not mark the task complete, and do not edit or weaken the checks to get past this."
  } >&2
  exit 2
fi

exit 0
