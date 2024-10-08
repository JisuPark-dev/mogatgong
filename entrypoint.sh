#!/bin/bash

SYSTEM_ENV_CONFIG=$(env | grep "VITE_")
if [[ -n "$SYSTEM_ENV_CONFIG" ]]; then
  for file in ./assets/index*.js;
  do
    echo "$SYSTEM_ENV_CONFIG" | while IFS= read -r line;
    do
      key=$(echo "$line" | cut -d '=' -f 1)
      value=$(echo "$line" | cut -d '=' -f 2-)
      des=$(echo "%%$key%%")
      sed -i "s@${des}@${value}@g" $file
    done
       echo "$file"
  done
else
  echo "No SYSTEM_ENV_CONFIG variables found. Skipping..."
fi



APP_ENV_CONFIG=$(cat ".env.${APP_ENV}")
if [[ -n "$APP_ENV_CONFIG" ]]; then
  for file in ./assets/index*.js;
  do
    echo "$APP_ENV_CONFIG" | while IFS= read -r line;
    do
      key=$(echo "$line" | cut -d '=' -f 1)
      value=$(echo "$line" | cut -d '=' -f 2-)
      des=$(echo "%%$key%%")
      sed -i "s@\"${des}\"@${value}@g" $file
    done
       echo "$file"
  done
else
  echo "No APP_ENV_CONFIG variables found. Skipping..."
fi



APP_CONFIG=$(cat ".env")
if [[ -n "$APP_CONFIG" ]]; then
  for file in ./assets/index*.js;
  do
    echo "$APP_CONFIG" | while IFS= read -r line;
    do
      key=$(echo "$line" | cut -d '=' -f 1)
      value=$(echo "$line" | cut -d '=' -f 2-)
      des=$(echo "%%$key%%")
      sed -i "s@\"${des}\"@${value}@g" $file
    done
       echo "$file"
  done
else
  echo "No APP_CONFIG variables found. Skipping..."
fi
exec nginx -g 'daemon off;'
