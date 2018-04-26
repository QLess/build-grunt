#!/usr/bin/env bash

# Get the string of the FILEPATH passed in
for file in dist/*.war
do
  FILEPATH="$file"
done
[ -z "$FILEPATH" ] && echo "Missing param: dist file"

# Get the FILENAME
FILENAME=$(basename -- "$FILEPATH")

# Get the app name from package.json
APP=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' \
  | sed 's/[", ]//g')

echo "Deploying $APP's $FILEPATH"

# Get the user to SSH/SCP with
SSH_USER=${SSH_USER:-$USER}

# The web directory on the server
WEBSRV="/usr/local/qless"

# The commands to run for QM2
QMCMD=$(cat <<EOF
cd "$WEBSRV"/www/qm
rm -Rf *
unzip "$WEBSRV"/"$FILENAME" -d .
EOF
)

# The commands to run for non-QM2
NONQMCMD=$(cat <<EOF
cd /usr/local/jboss/server/default/deploy/qless/
rm "$APP"*.war
cp "$WEBSRV/$APP"*.war .
EOF
)

counter=1
while [ $counter -le 3 ]
do
  echo "------"

  echo "Test$counter: Removing old package"
  ssh "$SSH_USER@app.test$counter.int.qless.com" "cd $WEBSRV && rm $APP-*.war"

  echo "Test$counter: Pushing new package"
  scp "$FILEPATH" "$SSH_USER@app.test$counter.int.qless.com:$WEBSRV"

  echo "Test$counter: Deploying"
  if [ "$APP" = 'QueueManager2' ]; then
    ssh -T "$SSH_USER@app.test$counter.int.qless.com" "$QMCMD"
  else
    ssh -T "$SSH_USER@app.test$counter.int.qless.com" "$NONQMCMD"
  fi

  ((counter++))
done

echo "------\nNew package has been deployed"
