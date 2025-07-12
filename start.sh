if [ ! -d "./node_modules" ]; then
  npm install
fi
# check PRODUCTION=true
if [ "$PRODUCTION" = true ]; then
  ng build
fi
ng serve --host 0.0.0.0 --port 80 --disable-host-check