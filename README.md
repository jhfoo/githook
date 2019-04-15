# githook
Nodejs-based Lightweight webhook receiver for Git updates

## Features
1. Script response execution: runs your script in response to a Git event (eg. COMMIT)
2. Configuration-by-convention: name your scripts according to their domain-event type (eg. COMMIT on jhfoo/githook translates to jhfoo.githook.commit.sh)
