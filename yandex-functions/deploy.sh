#!/bin/bash

# NeoVision Yandex Cloud Functions Deployment Script
# Prerequisites: yc CLI installed and configured

set -e

FUNCTION_NAME="neovision-qtickets"
RUNTIME="nodejs18"
ENTRYPOINT="qtickets-proxy.handler"
MEMORY="128m"
TIMEOUT="10s"
FOLDER_ID="${YC_FOLDER_ID:-}"

echo "🚀 Deploying NeoVision Qtickets Function"
echo "=========================================="

# Check yc CLI
if ! command -v yc &> /dev/null; then
    echo "❌ Error: yc CLI not found"
    echo "Install: curl -sSL https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash"
    exit 1
fi

# Check folder ID
if [ -z "$FOLDER_ID" ]; then
    FOLDER_ID=$(yc config get folder-id 2>/dev/null || echo "")
    if [ -z "$FOLDER_ID" ]; then
        echo "❌ Error: No folder ID. Set YC_FOLDER_ID or run: yc init"
        exit 1
    fi
fi

echo "📁 Folder ID: $FOLDER_ID"

# Create zip package
echo "📦 Creating deployment package..."
cd "$(dirname "$0")"
zip -j qtickets-proxy.zip qtickets-proxy.js

# Check if function exists
FUNCTION_EXISTS=$(yc serverless function list --folder-id "$FOLDER_ID" --format json | grep -c "\"name\": \"$FUNCTION_NAME\"" || echo "0")

if [ "$FUNCTION_EXISTS" -gt "0" ]; then
    echo "📤 Updating existing function..."
    yc serverless function version create \
        --function-name "$FUNCTION_NAME" \
        --folder-id "$FOLDER_ID" \
        --runtime "$RUNTIME" \
        --entrypoint "$ENTRYPOINT" \
        --memory "$MEMORY" \
        --execution-timeout "$TIMEOUT" \
        --source-path qtickets-proxy.zip \
        --environment "QTICKETS_API_KEY=b2XdRH8Uxj1vCFb7lKKQZHTLWlCUNCZ1"
else
    echo "🆕 Creating new function..."
    yc serverless function create \
        --name "$FUNCTION_NAME" \
        --folder-id "$FOLDER_ID"

    yc serverless function version create \
        --function-name "$FUNCTION_NAME" \
        --folder-id "$FOLDER_ID" \
        --runtime "$RUNTIME" \
        --entrypoint "$ENTRYPOINT" \
        --memory "$MEMORY" \
        --execution-timeout "$TIMEOUT" \
        --source-path qtickets-proxy.zip \
        --environment "QTICKETS_API_KEY=b2XdRH8Uxj1vCFb7lKKQZHTLWlCUNCZ1"
fi

# Make function public
echo "🔓 Making function public..."
yc serverless function allow-unauthenticated-invoke "$FUNCTION_NAME" --folder-id "$FOLDER_ID"

# Get function URL
FUNCTION_ID=$(yc serverless function get "$FUNCTION_NAME" --folder-id "$FOLDER_ID" --format json | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
FUNCTION_URL="https://functions.yandexcloud.net/$FUNCTION_ID"

echo ""
echo "✅ Deployment complete!"
echo "========================"
echo "Function ID: $FUNCTION_ID"
echo "Function URL: $FUNCTION_URL"
echo ""
echo "Test endpoints:"
echo "  Events list: $FUNCTION_URL?path=/api/events"
echo "  Upcoming:    $FUNCTION_URL?path=/api/events/upcoming"
echo ""
echo "Update your .env with:"
echo "  VITE_API_URL=$FUNCTION_URL"

# Cleanup
rm -f qtickets-proxy.zip
