# githook
Nodejs-based Lightweight webhook receiver for Git updates

## Features
1. Script response execution: runs your script in response to a Git event (eg. COMMIT)
2. Configuration-by-convention: name your scripts according to their domain-event type (eg. COMMIT on jhfoo/githook translates to jhfoo.githook.commit.sh)
3. Self update: in theory if you fork this code your forked version of githook can be updated in the same way
4. PM2 friendly: go check pm2.io if not familiar

## Roadmap
1. Ignore filters: not all files (eg. *.MD) need an update
2. Log to file
