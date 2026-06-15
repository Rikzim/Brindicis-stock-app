#!/bin/sh
BACKEND_DIR="${1:-../Brindicis-backend}"
SRC="$BACKEND_DIR/packages/api-client/dist"
DST="packages/api-client/dist"

if [ ! -d "$SRC" ]; then
  echo "Error: $SRC not found. Build the api-client package first:"
  echo "  cd $BACKEND_DIR && make api-client"
  exit 1
fi

mkdir -p "$(dirname "$DST")"
cp -r "$SRC" "$DST"
echo "Copied $SRC → $DST"
